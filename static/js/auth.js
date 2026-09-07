// auth.js - UniMS Authentication Module
// Quản lý đăng nhập, phân quyền, phiên làm việc
// Hỗ trợ: Single-session enforcement, Remember Me, IP tracking

const Auth = {
  SESSION_KEY: 'unims_session',
  REMEMBER_KEY: 'unims_remember_me',
  _sessionChannel: null,
  _heartbeatTimer: null,

  // === Initialize Session Guard ===
  init() {
    // BroadcastChannel for same-browser cross-tab communication
    try {
      this._sessionChannel = new BroadcastChannel('unims_session_channel');
      this._sessionChannel.onmessage = (event) => {
        const msg = event.data;
        if (msg.type === 'FORCE_LOGOUT' && msg.userId === this.getCurrentUser()?.id) {
          // Another tab of the same user just logged in — force this tab out
          this._forceLogoutUI(msg.reason || 'Tài khoản đã đăng nhập ở tab/cửa sổ khác.');
        }
      };
    } catch(e) {
      console.log('BroadcastChannel not supported, using storage events.');
    }

    // StorageEvent for cross-browser-tab / cross-device detection via localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'unims_active_sessions') {
        this._checkSessionValidity();
      }
    });

    // Periodic heartbeat: check every 3 seconds if our session is still the active one
    this._heartbeatTimer = setInterval(() => {
      this._checkSessionValidity();
    }, 3000);
  },

  // === Session Management ===
  getCurrentUser() {
    let data = sessionStorage.getItem(this.SESSION_KEY);
    if (!data) {
      data = localStorage.getItem(this.SESSION_KEY + '_auto');
      if (data) {
        // Restore session from auto-login, but verify it's still valid
        const parsed = JSON.parse(data);
        if (this._isSessionActive(parsed.id, parsed.sessionToken)) {
          sessionStorage.setItem(this.SESSION_KEY, data);
        } else {
          // Session was invalidated (another device logged in)
          localStorage.removeItem(this.SESSION_KEY + '_auto');
          return null;
        }
      }
    }
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Generate unique session token
  _generateSessionToken() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 11);
  },

  // === Active Sessions Registry (localStorage) ===
  _getActiveSessions() {
    return JSON.parse(localStorage.getItem('unims_active_sessions')) || {};
  },

  _saveActiveSessions(sessions) {
    localStorage.setItem('unims_active_sessions', JSON.stringify(sessions));
  },

  _registerSession(userId, sessionToken, sessionInfo) {
    const sessions = this._getActiveSessions();
    sessions[userId] = {
      token: sessionToken,
      ip: sessionInfo.ip || 'Đang phân tích...',
      device: sessionInfo.device || navigator.userAgent,
      loginAt: sessionInfo.loginAt,
      username: sessionInfo.username
    };
    this._saveActiveSessions(sessions);
  },

  _removeSession(userId) {
    const sessions = this._getActiveSessions();
    delete sessions[userId];
    this._saveActiveSessions(sessions);
  },

  _isSessionActive(userId, token) {
    const sessions = this._getActiveSessions();
    return sessions[userId] && sessions[userId].token === token;
  },

  // === Login ===
  login(username, password, role, universityId) {
    const users = Database.users.getAll();
    let user;

    if (role === 'admin') {
      user = users.find(u => u.username === username && u.password === password && u.role === 'admin');
    } else {
      user = users.find(u =>
        u.username === username &&
        u.password === password &&
        u.role === role &&
        u.universityId == universityId
      );
    }

    if (user) {
      const sessionToken = this._generateSessionToken();

      // Check if user already has an active session — force old one out
      const existingSessions = this._getActiveSessions();
      const existingSession = existingSessions[user.id];

      const session = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        avatar: user.avatar || null,
        linkedId: user.linkedId || null,
        universityId: role === 'admin' ? parseInt(universityId) : user.universityId,
        device: navigator.userAgent,
        loginAt: new Date().toISOString(),
        sessionToken: sessionToken
      };

      // Notify other tabs in this browser to logout
      if (existingSession) {
        try {
          this._sessionChannel?.postMessage({
            type: 'FORCE_LOGOUT',
            userId: user.id,
            reason: 'Tài khoản này vừa đăng nhập từ nơi khác. Phiên cũ đã bị đăng xuất tự động.'
          });
        } catch(e) {}

        // Log the forced logout
        Database.activity.add('force_logout', 'user', user.id,
          `Phiên cũ của ${user.name} bị đăng xuất (đăng nhập mới từ thiết bị khác)`);
      }

      // Register this as THE active session for this user
      this._registerSession(user.id, sessionToken, session);

      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(this.SESSION_KEY + '_auto', JSON.stringify(session));

      // Record login history immediately (with IP = Unknown)
      if (Database.loginHistory) {
        Database.loginHistory.add(user.id, session);
      }

      // Try to fetch IP asynchronously and update
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          session.ip = data.ip;
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(this.SESSION_KEY + '_auto', JSON.stringify(session));
          // Also update the active session registry with real IP
          this._registerSession(user.id, sessionToken, session);
        })
        .catch(err => console.log('Could not fetch IP'));

      Database.activity.add('login', 'user', user.id,
        `${user.name} đã đăng nhập (${this.getRoleLabel(user.role)})`);
      return { success: true, user: session };
    }
    return { success: false };
  },

  // === Logout ===
  logout() {
    const user = this.getCurrentUser();
    if (user) {
      Database.activity.add('logout', 'user', user.id, `${user.name} đã đăng xuất`);
      this._removeSession(user.id);
    }
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY + '_auto');
  },

  // === Force Logout UI ===
  _forceLoggedOut: false,

  _forceLogoutUI(reason) {
    // Prevent duplicate calls from heartbeat
    if (this._forceLoggedOut) return;
    this._forceLoggedOut = true;

    // Stop heartbeat immediately
    clearInterval(this._heartbeatTimer);

    // Clean up session completely
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY + '_auto');

    // Remove any existing overlay first
    const existing = document.getElementById('force-logout-overlay');
    if (existing) existing.remove();

    // Show notification modal with countdown
    const overlay = document.createElement('div');
    overlay.id = 'force-logout-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.85); z-index: 99999;
      display: flex; justify-content: center; align-items: center;
      backdrop-filter: blur(8px);
    `;
    overlay.innerHTML = `
      <div style="
        background: var(--bg-primary, #fff); border-radius: 16px; padding: 32px 28px;
        max-width: 420px; width: 90%; text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          display: flex; justify-content: center; align-items: center;
          margin: 0 auto 16px;
        ">
          <i class="fas fa-shield-alt" style="color: white; font-size: 1.5rem;"></i>
        </div>
        <h3 style="margin: 0 0 8px; color: var(--text-primary, #1e293b); font-size: 1.2rem;">
          ⚠️ Phiên đăng nhập đã kết thúc
        </h3>
        <p style="color: var(--text-secondary, #64748b); font-size: 0.9rem; margin: 0 0 12px; line-height: 1.5;">
          ${reason}
        </p>
        <p id="force-logout-countdown" style="color: #ef4444; font-size: 0.85rem; margin: 0 0 20px; font-weight: 600;">
          Tự động chuyển hướng sau <span id="countdown-seconds">3</span> giây...
        </p>
        <button id="force-logout-btn" style="
          background: linear-gradient(135deg, #3b82f6, #2563eb); color: white;
          border: none; padding: 10px 28px; border-radius: 8px; font-size: 0.95rem;
          cursor: pointer; font-weight: 600;
        ">
          <i class="fas fa-sign-in-alt" style="margin-right: 6px;"></i>Đăng nhập lại ngay
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Force redirect function
    const doRedirect = () => {
      window.location.href = '/#/login';
      window.location.reload();
    };

    // Immediate click handler
    document.getElementById('force-logout-btn').addEventListener('click', doRedirect);

    // Auto-redirect countdown (3 seconds)
    let seconds = 3;
    const countdownEl = document.getElementById('countdown-seconds');
    const countdownTimer = setInterval(() => {
      seconds--;
      if (countdownEl) countdownEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(countdownTimer);
        doRedirect();
      }
    }, 1000);
  },

  // === Check Session Validity (heartbeat) ===
  _checkSessionValidity() {
    if (this._forceLoggedOut) return;

    const data = sessionStorage.getItem(this.SESSION_KEY);
    if (!data) return;

    const user = JSON.parse(data);
    if (!user || !user.sessionToken) return;

    if (!this._isSessionActive(user.id, user.sessionToken)) {
      // Our token is no longer the active one — we've been kicked
      this._forceLogoutUI('Tài khoản này đã đăng nhập từ thiết bị hoặc trình duyệt khác. Phiên hiện tại đã bị đăng xuất tự động để bảo mật.');
    }
  },

  // === Remember Me ===
  saveRememberMe(username, password, role, universityId) {
    const data = { username, password, role, universityId, savedAt: new Date().toISOString() };
    localStorage.setItem(this.REMEMBER_KEY, JSON.stringify(data));
  },

  getRememberMe() {
    const data = localStorage.getItem(this.REMEMBER_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearRememberMe() {
    localStorage.removeItem(this.REMEMBER_KEY);
  },

  // === Role Checks ===
  isAdmin()   { return this.getCurrentUser()?.role === 'admin'; },
  isTeacher() { return this.getCurrentUser()?.role === 'teacher'; },
  isStudent() { return this.getCurrentUser()?.role === 'student'; },
  hasRole(r)  { return this.getCurrentUser()?.role === r; },

  // === Feature Access Control ===
  canAccess(feature) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const perms = {
      admin:   ['dashboard','students','teachers','classes','registration','grades','chatbot','helpdesk','workshop','notifications','profile'],
      teacher: ['dashboard','students','classes','grades','chatbot','helpdesk','notifications','profile'],
      student: ['dashboard','classes','registration','tuition','grades','chatbot','helpdesk','notifications','profile']
    };
    return perms[user.role]?.includes(feature) ?? false;
  },

  // === Helpers ===
  getRoleLabel(role) {
    const lang = Database?.settings?.get()?.language || 'vi';
    const labels = {
      admin:   { vi: 'Quản trị viên', en: 'Administrator' },
      teacher: { vi: 'Giáo viên',     en: 'Teacher' },
      student: { vi: 'Sinh viên',     en: 'Student' }
    };
    return labels[role]?.[lang] || role;
  },

  getRoleIcon(role) {
    return { admin: 'fas fa-user-shield', teacher: 'fas fa-chalkboard-teacher', student: 'fas fa-user-graduate' }[role] || 'fas fa-user';
  },

  // Change password
  changePassword(userId, oldPass, newPass) {
    const users = Database.users.getAll();
    const idx = users.findIndex(u => u.id === userId && u.password === oldPass);
    if (idx !== -1) {
      users[idx].password = newPass;
      Database._save('unims_users', users);
      return true;
    }
    return false;
  }
};

// Initialize Auth session guard when script loads
Auth.init();
