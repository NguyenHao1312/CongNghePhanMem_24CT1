// auth.js - UniMS Authentication Module
// Quản lý đăng nhập, phân quyền, phiên làm việc

const Auth = {
  SESSION_KEY: 'unims_session',

  // === Session Management ===
  getCurrentUser() {
    let data = sessionStorage.getItem(this.SESSION_KEY);
    if (!data) {
      data = localStorage.getItem(this.SESSION_KEY + '_auto');
      if (data) {
        // Restore session from auto-login
        sessionStorage.setItem(this.SESSION_KEY, data);
      }
    }
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  login(username, password, role, universityId) {
    const users = Database.users.getAll();
    let user;

    if (role === 'admin') {
      // Admin bypasses university check
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
      const session = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        avatar: user.avatar || null,
        linkedId: user.linkedId || null,
        universityId: role === 'admin' ? parseInt(universityId) : user.universityId,
        device: navigator.userAgent,
        loginAt: new Date().toISOString()
      };
      
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(this.SESSION_KEY + '_auto', JSON.stringify(session));
      
      // Record login history immediately (with IP = Unknown)
      if (Database.loginHistory) {
         Database.loginHistory.add(user.id, session);
      }

      // Try to fetch IP asynchronously and update the stored session
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          session.ip = data.ip;
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(this.SESSION_KEY + '_auto', JSON.stringify(session));
        })
        .catch(err => console.log('Could not fetch IP'));

      Database.activity.add('login', 'user', user.id,
        `${user.name} đã đăng nhập (${this.getRoleLabel(user.role)})`);
      return { success: true, user: session };
    }
    return { success: false };
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      Database.activity.add('logout', 'user', user.id, `${user.name} đã đăng xuất`);
    }
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY + '_auto');
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
