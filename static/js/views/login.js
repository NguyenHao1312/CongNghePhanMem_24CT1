// login.js
const I18N = {
  vi: {
    subtitle: 'Hệ thống Quản lý Đại học Thông minh',
    roleStudent: '<i class="fas fa-user-graduate" style="margin-right: 6px;"></i> Sinh viên',
    roleTeacher: '<i class="fas fa-chalkboard-teacher" style="margin-right: 6px;"></i> Giáo viên',
    loginUsernameLabel: 'Mã sinh viên / giáo viên',
    loginUsernamePlaceholder: 'Nhập mã số...',
    loginPasswordLabel: 'Mật khẩu',
    loginPasswordPlaceholder: 'Nhập mật khẩu...',
    rememberMe: ' Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    btnLogin: 'Đăng nhập <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i>',
    notHaveAccount: 'Chưa có tài khoản? <span style="color: var(--primary-500); font-weight: 600;">Tạo tài khoản</span>',
    signupUsernameLabel: 'Mã số (Sinh viên / Giáo viên)',
    signupUsernamePlaceholder: 'Nhập mã số của bạn...',
    signupNameLabel: 'Họ và tên',
    signupNamePlaceholder: 'Họ và tên đầy đủ...',
    signupPasswordLabel: 'Mật khẩu',
    signupPasswordPlaceholder: 'Tạo mật khẩu...',
    btnSignup: 'Đăng ký <i class="fas fa-user-plus" style="margin-left: 8px;"></i>',
    alreadyHaveAccount: 'Đã có tài khoản? <span style="color: var(--primary-500); font-weight: 600;">Đăng nhập</span>',
    footer: '&copy; 2026 UniMS - University Management System',
    themePixel: '<i class="fas fa-apple-alt" style="margin-right: 8px;"></i>Trái cây Pixel',
    themeSolar: '<i class="fas fa-globe" style="margin-right: 8px;"></i>Hệ mặt trời',
    themeUni: '<i class="fas fa-university" style="margin-right: 8px;"></i>Đại học Đà Nẵng',
    colorDefault: '<i class="fas fa-tint" style="margin-right: 8px; color: #2563eb;"></i>Mặc định',
    colorJade: '<i class="fas fa-leaf" style="margin-right: 8px; color: #14b8a6;"></i>Xanh ngọc bích',
    colorBlack: '<i class="fas fa-moon" style="margin-right: 8px; color: #334155;"></i>Đen tuyền',
    colorWhite: '<i class="fas fa-sun" style="margin-right: 8px; color: #cbd5e1;"></i>Trắng xóa',
    selectUniversityLabel: 'Chọn trường Đại học',
    selectUniversityPlaceholder: '-- Chọn trường của bạn --'
  },
  en: {
    subtitle: 'Smart University Management System',
    roleStudent: '<i class="fas fa-user-graduate" style="margin-right: 6px;"></i> Student',
    roleTeacher: '<i class="fas fa-chalkboard-teacher" style="margin-right: 6px;"></i> Teacher',
    loginUsernameLabel: 'Student / Teacher ID',
    loginUsernamePlaceholder: 'Enter ID...',
    loginPasswordLabel: 'Password',
    loginPasswordPlaceholder: 'Enter password...',
    rememberMe: ' Remember me',
    forgotPassword: 'Forgot password?',
    btnLogin: 'Login <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i>',
    notHaveAccount: 'Don\'t have an account? <span style="color: var(--primary-500); font-weight: 600;">Sign up</span>',
    signupUsernameLabel: 'ID (Student / Teacher)',
    signupUsernamePlaceholder: 'Enter your ID...',
    signupNameLabel: 'Full Name',
    signupNamePlaceholder: 'Your full name...',
    signupPasswordLabel: 'Password',
    signupPasswordPlaceholder: 'Create password...',
    btnSignup: 'Sign up <i class="fas fa-user-plus" style="margin-left: 8px;"></i>',
    alreadyHaveAccount: 'Already have an account? <span style="color: var(--primary-500); font-weight: 600;">Login</span>',
    footer: '&copy; 2026 UniMS - University Management System',
    themePixel: '<i class="fas fa-apple-alt" style="margin-right: 8px;"></i>Pixel Fruits',
    themeSolar: '<i class="fas fa-globe" style="margin-right: 8px;"></i>Solar System',
    themeUni: '<i class="fas fa-university" style="margin-right: 8px;"></i>Da Nang Universities',
    colorDefault: '<i class="fas fa-tint" style="margin-right: 8px; color: #2563eb;"></i>Default',
    colorJade: '<i class="fas fa-leaf" style="margin-right: 8px; color: #14b8a6;"></i>Jade Green',
    colorBlack: '<i class="fas fa-moon" style="margin-right: 8px; color: #334155;"></i>Pitch Black',
    colorWhite: '<i class="fas fa-sun" style="margin-right: 8px; color: #cbd5e1;"></i>Pure White',
    selectUniversityLabel: 'Select University',
    selectUniversityPlaceholder: '-- Select your university --'
  }
};

const LoginView = {
  currentLang: 'vi',
  _bounceAnimFrame: null,

  // Clean up login UI completely so App.init() can rebuild
  destroy() {
    // Stop bouncing blocks animation
    if (this._bounceAnimFrame) {
      cancelAnimationFrame(this._bounceAnimFrame);
      this._bounceAnimFrame = null;
    }
    // Remove login container
    const loginContainer = document.getElementById('unims-login-container');
    if (loginContainer) loginContainer.remove();
    // Restore sidebar, header, fab
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('top-header');
    const mainWrapper = document.getElementById('main-wrapper');
    const fab = document.getElementById('chatbot-fab');
    if (sidebar) sidebar.style.display = '';
    if (header) header.style.display = '';
    if (fab) fab.style.display = '';
    if (mainWrapper) {
      mainWrapper.style.marginLeft = '';
      mainWrapper.style.padding = '';
    }
  },

  render() {
    // Hide sidebar and top header
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('top-header');
    const mainWrapper = document.getElementById('main-wrapper');
    const fab = document.getElementById('chatbot-fab');
    
    if (sidebar) sidebar.style.display = 'none';
    if (header) header.style.display = 'none';
    if (fab) fab.style.display = 'none';
    if (mainWrapper) {
      mainWrapper.style.marginLeft = '0';
      mainWrapper.style.padding = '0';
    }

    // Check if already exists
    let loginContainer = document.getElementById('unims-login-container');
    if (loginContainer) loginContainer.remove();

    // Cancel previous animation loop
    if (this._bounceAnimFrame) {
      cancelAnimationFrame(this._bounceAnimFrame);
      this._bounceAnimFrame = null;
    }

    loginContainer = document.createElement('div');
    loginContainer.id = 'unims-login-container';
    loginContainer.className = 'login-container';

    loginContainer.innerHTML = `
        <style>
          #unims-login-container { transition: background 1.5s ease-in-out; }
          #unims-login-container.theme-forest { background: linear-gradient(to bottom, #0f172a, #064e3b, #022c22) !important; }
          #unims-login-container select option { background-color: var(--bg-primary); color: var(--text-primary); }
        </style>
        <!-- Animated Background Particles -->
        <div class="login-particles" id="login-particles"></div>
        <!-- Bouncing Blocks Canvas -->
        <canvas id="bounce-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto; touch-action: none; z-index: 0;"></canvas>
        
        <!-- Theme Switcher -->
        <style>
          .theme-option:hover { background: rgba(0,0,0,0.05) !important; }
          .dropdown-btn:hover { transform: scale(1.1); }
        </style>
        <div id="login-theme-switcher" class="login-theme-switcher">
          <!-- Hide Form Button -->
          <button id="btn-toggle-form" title="Ẩn/Hiện Form để chơi đùa" style="width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); color: #ef4444; font-size: 1.1rem; transition: transform 0.2s;">
            <i class="fas fa-eye-slash" id="icon-toggle-form"></i>
          </button>
          <!-- Icon Theme Dropdown -->
          <div style="position: relative;" class="custom-dropdown">
            <button class="dropdown-btn" id="btn-icon-theme" title="Thay đổi icon" style="width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); color: #1e293b; font-size: 1.1rem; transition: transform 0.2s;">
              <i class="fas fa-shapes"></i>
            </button>
            <div id="menu-icon-theme" style="display: none; position: absolute; right: 0; top: 115%; background: rgba(255,255,255,0.95); border-radius: var(--radius-md); box-shadow: 0 4px 15px rgba(0,0,0,0.15); min-width: 170px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); padding: 5px 0; backdrop-filter: blur(10px);">
              <div class="theme-option" data-theme-type="icon" data-value="fruits" data-i18n="themePixel" style="padding: 10px 15px; cursor: pointer; font-size: 0.9rem; color: #1e293b; font-weight: 500;"><i class="fas fa-apple-alt" style="margin-right: 8px;"></i>Trái cây Pixel</div>
              <div class="theme-option" data-theme-type="icon" data-value="planets" data-i18n="themeSolar" style="padding: 10px 15px; cursor: pointer; font-size: 0.9rem; color: #1e293b; font-weight: 500;"><i class="fas fa-globe" style="margin-right: 8px;"></i>Hệ mặt trời</div>
              <div class="theme-option" data-theme-type="icon" data-value="unis" data-i18n="themeUni" style="padding: 10px 15px; cursor: pointer; font-size: 0.9rem; color: #1e293b; font-weight: 500;"><i class="fas fa-university" style="margin-right: 8px;"></i>Đại học Đà Nẵng</div>
            </div>
          </div>
          <!-- Color Theme Dropdown (3 colors: Jade default, Black, White) -->
          <div style="position: relative;" class="custom-dropdown">
            <button class="dropdown-btn" id="btn-color-theme" title="Thay đổi màu nền" style="width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 2px solid #14b8a6; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); color: #0d9488; font-size: 1.1rem; transition: transform 0.2s;">
              <i class="fas fa-palette"></i>
            </button>
            <div id="menu-color-theme" style="display: none; position: absolute; right: 0; top: 115%; background: rgba(255,255,255,0.97); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); min-width: 190px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); padding: 6px; backdrop-filter: blur(12px);">
              <div class="theme-option active-color" data-theme-type="color" data-value="jade" style="padding: 10px 14px; cursor: pointer; font-size: 0.88rem; color: #1e293b; font-weight: 600; border-radius: 8px; display: flex; align-items: center; gap: 10px; background: rgba(20,184,166,0.08);">
                <span style="width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,#0d9488,#14b8a6); flex-shrink:0; box-shadow:0 2px 6px rgba(13,148,136,0.4); border: 2px solid rgba(255,255,255,0.6);"></span>
                <span data-i18n="colorJade">Xanh ngọc bích ✓</span>
              </div>
              <div class="theme-option" data-theme-type="color" data-value="black" style="padding: 10px 14px; cursor: pointer; font-size: 0.88rem; color: #1e293b; font-weight: 500; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                <span style="width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,#0f172a,#334155); flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.6);"></span>
                <span data-i18n="colorBlack">Đen tuyền</span>
              </div>
              <div class="theme-option" data-theme-type="color" data-value="white" style="padding: 10px 14px; cursor: pointer; font-size: 0.88rem; color: #1e293b; font-weight: 500; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                <span style="width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,#e2e8f0,#f8fafc); flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.12); border: 2px solid #cbd5e1;"></span>
                <span data-i18n="colorWhite">Trắng xóa</span>
              </div>
            </div>
          </div>
          <!-- Language Dropdown -->
          <div style="position: relative;" class="custom-dropdown">
            <button class="dropdown-btn" id="btn-lang-theme" title="Ngôn ngữ / Language" style="width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); color: #1e293b; font-size: 1.1rem; transition: transform 0.2s; font-weight: 700; font-family: sans-serif;">
              VN
            </button>
            <div id="menu-lang-theme" style="display: none; position: absolute; right: 0; top: 115%; background: rgba(255,255,255,0.95); border-radius: var(--radius-md); box-shadow: 0 4px 15px rgba(0,0,0,0.15); min-width: 140px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); padding: 5px 0; backdrop-filter: blur(10px);">
              <div class="lang-option" data-lang="vi" style="padding: 10px 15px; cursor: pointer; font-size: 0.9rem; color: #1e293b; font-weight: 500;">🇻🇳 Tiếng Việt</div>
              <div class="lang-option" data-lang="en" style="padding: 10px 15px; cursor: pointer; font-size: 0.9rem; color: #1e293b; font-weight: 500;">🇬🇧 English</div>
            </div>
          </div>
        </div>
        
        <div class="login-card" id="login-card">
          <div class="login-header">
            <div class="login-logo">
              <i class="fas fa-graduation-cap"></i> UniMS
            </div>
            <div class="login-subtitle" id="login-subtitle" data-i18n="subtitle">Hệ thống Quản lý Đại học Thông minh</div>
          </div>

          <div class="role-tabs">
            <div class="role-tab active" data-role="student" data-i18n="roleStudent">
              <i class="fas fa-user-graduate" style="margin-right: 6px;"></i> Sinh viên
            </div>
            <div class="role-tab" data-role="teacher" data-i18n="roleTeacher">
              <i class="fas fa-chalkboard-teacher" style="margin-right: 6px;"></i> Giáo viên
            </div>
          </div>

          <!-- LOGIN FORM -->
          <form id="login-form">
            <div class="form-group" id="login-university-group" style="margin-bottom: 0.75rem;">
              <label for="login-university" data-i18n="selectUniversityLabel">Chọn trường Đại học</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <span class="input-group-text" id="login-uni-icon" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none; width: 44px; display: flex; justify-content: center;"><i class="fas fa-university"></i></span>
                <select id="login-university" class="form-control" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
                  <!-- Populated by JS -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="login-username" data-i18n="loginUsernameLabel">Mã sinh viên / giáo viên</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; transition: border-color 0.3s, box-shadow 0.3s;">
                <span class="input-group-text" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none;"><i class="fas fa-user"></i></span>
                <input type="text" id="login-username" class="form-control" placeholder="Nhập mã số..." data-i18n-placeholder="loginUsernamePlaceholder" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
              </div>
            </div>

            <div class="form-group" style="margin-top: 0.75rem;">
              <label for="login-password" data-i18n="loginPasswordLabel">Mật khẩu</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; transition: border-color 0.3s, box-shadow 0.3s;">
                <span class="input-group-text" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none;"><i class="fas fa-lock"></i></span>
                <input type="password" id="login-password" class="form-control" placeholder="Nhập mật khẩu..." data-i18n-placeholder="loginPasswordPlaceholder" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
                <span class="input-group-text" id="toggle-password" style="cursor: pointer; padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none; transition: color 0.2s;"><i class="fas fa-eye"></i></span>
              </div>
            </div>

            <!-- Inline Error Message for Login -->
            <div id="login-error-msg" style="display: none; margin-top: 12px; padding: 10px 14px; background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08)); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-md); color: #ef4444; font-size: 0.88rem; animation: shakeError 0.4s ease;">
              <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
              <span id="login-error-text"></span>
            </div>

            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; color: var(--text-secondary);">
                <input type="checkbox" id="remember-me" style="accent-color: var(--primary-500);"><span data-i18n="rememberMe"> Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" id="forgot-password-link" data-i18n="forgotPassword" style="color: var(--primary-500); font-size: var(--font-size-sm); text-decoration: none; transition: color 0.2s;">Quên mật khẩu?</a>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-login-submit" data-i18n="btnLogin" style="width: 100%; margin-top: 1.25rem; padding: 12px; font-size: 1rem; border-radius: var(--radius-md); transition: transform 0.2s, box-shadow 0.2s;">
              Đăng nhập <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i>
            </button>
            
            <div style="text-align: center; margin-top: 0.75rem;">
              <a href="#" id="toggle-signup-link" data-i18n="notHaveAccount" style="color: var(--text-secondary); font-size: 0.9rem; text-decoration: none;">Chưa có tài khoản? <span style="color: var(--primary-500); font-weight: 600;">Tạo tài khoản</span></a>
            </div>
          </form>

          <!-- SIGNUP FORM (Hidden by default) -->
          <form id="signup-form" style="display: none;">
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label for="signup-university" data-i18n="selectUniversityLabel">Chọn trường Đại học</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <span class="input-group-text" id="signup-uni-icon" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none; width: 44px; display: flex; justify-content: center;"><i class="fas fa-university"></i></span>
                <select id="signup-university" class="form-control" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
                  <!-- Populated by JS -->
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="signup-username" data-i18n="signupUsernameLabel">Mã số (Sinh viên / Giáo viên)</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <span class="input-group-text" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none;"><i class="fas fa-id-card"></i></span>
                <input type="text" id="signup-username" class="form-control" placeholder="Nhập mã số của bạn..." data-i18n-placeholder="signupUsernamePlaceholder" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
              </div>
            </div>

            <div class="form-group" style="margin-top: 0.75rem;">
              <label for="signup-name" data-i18n="signupNameLabel">Họ và tên</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <span class="input-group-text" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none;"><i class="fas fa-user-edit"></i></span>
                <input type="text" id="signup-name" class="form-control" placeholder="Họ và tên đầy đủ..." data-i18n-placeholder="signupNamePlaceholder" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
              </div>
            </div>

            <div class="form-group" style="margin-top: 0.75rem;">
              <label for="signup-password" data-i18n="signupPasswordLabel">Mật khẩu</label>
              <div class="input-group" style="display: flex; align-items: center; background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <span class="input-group-text" style="padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none;"><i class="fas fa-lock"></i></span>
                <input type="password" id="signup-password" class="form-control" placeholder="Tạo mật khẩu..." data-i18n-placeholder="signupPasswordPlaceholder" style="border: none; outline: none; box-shadow: none; width: 100%; padding: 12px 10px; background: transparent; color: var(--text-primary);">
                <span class="input-group-text" id="toggle-signup-password" style="cursor: pointer; padding: 10px 15px; color: var(--text-tertiary); background: transparent; border: none; transition: color 0.2s;"><i class="fas fa-eye"></i></span>
              </div>
            </div>

            <!-- Inline Error Message for Signup -->
            <div id="signup-error-msg" style="display: none; margin-top: 12px; padding: 10px 14px; background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08)); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-md); color: #ef4444; font-size: 0.88rem; animation: shakeError 0.4s ease;">
              <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
              <span id="signup-error-text"></span>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-signup-submit" data-i18n="btnSignup" style="width: 100%; margin-top: 1.25rem; padding: 12px; font-size: 1rem; border-radius: var(--radius-md); background: var(--success); border-color: var(--success);">
              Đăng ký <i class="fas fa-user-plus" style="margin-left: 8px;"></i>
            </button>
            
            <div style="text-align: center; margin-top: 0.75rem;">
              <a href="#" id="toggle-login-link" data-i18n="alreadyHaveAccount" style="color: var(--text-secondary); font-size: 0.9rem; text-decoration: none;">Đã có tài khoản? <span style="color: var(--primary-500); font-weight: 600;">Đăng nhập</span></a>
            </div>
          </form>
          
          <div style="text-align: center; margin-top: var(--space-4); color: var(--text-tertiary); font-size: 0.8rem;" data-i18n="footer">
            &copy; 2026 UniMS - University Management System
          </div>
        </div>
    `;

    document.body.appendChild(loginContainer);

    this.createParticles();
    
    // Initialize new Physics Engine
    if (window.LoginBackground) {
      this.bgEngine = new window.LoginBackground('bounce-canvas');
    }
    
    this.populateUniversities();
    this.bindEvents();
    this.initTranslations();

    // ✅ Apply Jade (Teal) as default background immediately
    loginContainer.style.background = 'linear-gradient(135deg, #042f2e 0%, #0d9488 40%, #1d4ed8 80%, #0f172a 100%)';

    // ✅ Auto-focus on username field
    setTimeout(() => {
      const usernameInput = document.getElementById('login-username');
      if (usernameInput) usernameInput.focus();
    }, 300);

    // ✅ Clear login error when user starts typing
    ['login-username', 'login-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.hideInlineError('login-error-msg'));
    });
    ['signup-username', 'signup-name', 'signup-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.hideInlineError('signup-error-msg'));
    });
  },

  populateUniversities() {
    const loginSelect = document.getElementById('login-university');
    const signupSelect = document.getElementById('signup-university');
    if (!loginSelect || !signupSelect) return;
    
    const lang = this.currentLang || 'vi';
    const options = Database.UNIVERSITIES.map(u => {
      const name = lang === 'en' ? (u.enName || u.name) : u.name;
      return `<option value="${u.id}">${name}</option>`;
    }).join('');
    loginSelect.innerHTML = options;
    signupSelect.innerHTML = options;
  },


  createParticles() {
    const container = document.getElementById('login-particles');
    if (!container) return;
    container.innerHTML = '';
    const shapes = ['circle', 'square', 'triangle'];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'login-particle';
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 20 + 8;
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: rgba(59, 130, 246, ${Math.random() * 0.15 + 0.05});
        border-radius: ${shape === 'circle' ? '50%' : shape === 'square' ? '4px' : '50%'};
        animation: floatParticle ${Math.random() * 15 + 10}s linear infinite;
        animation-delay: ${Math.random() * -20}s;
        pointer-events: none;
      `;
      container.appendChild(particle);
    }
  },

  // Helper to show inline error
  showInlineError(containerId, textId, message) {
    const container = document.getElementById(containerId);
    const text = document.getElementById(textId);
    if (container && text) {
      text.textContent = message;
      container.style.display = 'block';
      // Re-trigger shake animation
      container.style.animation = 'none';
      container.offsetHeight; // reflow
      container.style.animation = 'shakeError 0.4s ease';
      // Auto-hide after 6 seconds
      clearTimeout(container._hideTimer);
      container._hideTimer = setTimeout(() => {
        container.style.display = 'none';
      }, 6000);
    }
  },

  hideInlineError(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.style.display = 'none';
  },

  updateLanguage() {
    const lang = this.currentLang;
    const dict = I18N[lang];
    
    // Update innerHTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.placeholder = dict[key];
    });
    
    // Update button text
    const langBtn = document.getElementById('btn-lang-theme');
    if (langBtn) {
      langBtn.textContent = lang === 'vi' ? 'VN' : 'EN';
    }
    
    // Sync active physics background texts dynamically
    if (this.bgEngine && typeof this.bgEngine.spawnBlocks === 'function') {
      this.bgEngine.spawnBlocks();
    }
    
    // Repopulate universities dropdown to reflect language changes
    this.populateUniversities();
  },

  bindEvents() {
    let currentRole = 'student';
    let isSignupMode = false;
    const loginContainer = document.getElementById('unims-login-container');
    const loginCard = document.getElementById('login-card');
    
    // Toggle Form visibility
    const btnToggleForm = document.getElementById('btn-toggle-form');
    if (btnToggleForm) {
      btnToggleForm.addEventListener('click', () => {
        const icon = document.getElementById('icon-toggle-form');
        if (loginCard.style.opacity === '0') {
          loginCard.style.opacity = '1';
          loginCard.style.pointerEvents = 'auto';
          loginCard.style.transform = 'scale(1)';
          icon.className = 'fas fa-eye-slash';
          btnToggleForm.style.color = '#ef4444';
        } else {
          loginCard.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          loginCard.style.opacity = '0';
          loginCard.style.pointerEvents = 'none';
          loginCard.style.transform = 'scale(0.8)';
          icon.className = 'fas fa-eye';
          btnToggleForm.style.color = '#10b981';
        }
      });
    }
    
    // Ripple Effect on background click
    if (loginContainer) {
      loginContainer.addEventListener('mousedown', (e) => {
        // Prevent ripple if clicking inside the card
        if (loginCard && loginCard.contains(e.target)) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'water-ripple';
        
        const rect = loginContainer.getBoundingClientRect();
        const size = 150; // Max size of ripple
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-animation 0.8s ease-out';
        ripple.style.pointerEvents = 'none';
        
        loginContainer.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 800);
      });
    }

    // Handle Custom Dropdowns
    const iconBtn = document.getElementById('btn-icon-theme');
    const iconMenu = document.getElementById('menu-icon-theme');
    const colorBtn = document.getElementById('btn-color-theme');
    const colorMenu = document.getElementById('menu-color-theme');
    const langBtn = document.getElementById('btn-lang-theme');
    const langMenu = document.getElementById('menu-lang-theme');

    const toggleMenu = (menu) => {
      const isVisible = menu.style.display === 'block';
      iconMenu.style.display = 'none';
      colorMenu.style.display = 'none';
      langMenu.style.display = 'none';
      if (!isVisible) menu.style.display = 'block';
    };

    if (iconBtn && iconMenu) {
      iconBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(iconMenu); });
    }
    if (colorBtn && colorMenu) {
      colorBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(colorMenu); });
    }
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(langMenu); });
    }

    document.addEventListener('click', () => {
      if (iconMenu) iconMenu.style.display = 'none';
      if (colorMenu) colorMenu.style.display = 'none';
      if (langMenu) langMenu.style.display = 'none';
    });
    
    // Handle Language change
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        this.currentLang = opt.getAttribute('data-lang');
        this.updateLanguage();
      });
    });

    const loginContainerElem = document.getElementById('unims-login-container');
    
    // Crossfade background helper
    const crossfadeBackground = (newGradient, isDark) => {
      let bgLayer = document.getElementById('bg-color-layer');
      if (!bgLayer) {
        bgLayer = document.createElement('div');
        bgLayer.id = 'bg-color-layer';
        bgLayer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; opacity: 0; transition: opacity 2s ease-in-out;';
        loginContainerElem.insertBefore(bgLayer, loginContainerElem.firstChild);
      }
      
      const newLayer = document.createElement('div');
      newLayer.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0; transition: opacity 2s ease-in-out; background: ${newGradient};`;
      loginContainerElem.insertBefore(newLayer, bgLayer.nextSibling);
      
      // Trigger reflow
      newLayer.offsetHeight; 
      newLayer.style.opacity = '1';
      
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      setTimeout(() => {
        bgLayer.style.background = newGradient;
        bgLayer.style.opacity = '1';
        newLayer.remove();
        // Update main container behind it just in case
        loginContainerElem.style.background = newGradient;
      }, 2000);
    };

    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const type = opt.getAttribute('data-theme-type');
        const val = opt.getAttribute('data-value');
        
        if (type === 'icon') {
          if (this.bgEngine) this.bgEngine.setTheme(val);
        } else if (type === 'color' && loginContainerElem) {
          // Update active indicator in dropdown
          document.querySelectorAll('#menu-color-theme .theme-option').forEach(o => {
            o.style.background = '';
            o.style.fontWeight = '500';
            const label = o.querySelector('span:last-child');
            if (label) label.textContent = label.textContent.replace(' ✓', '');
          });
          opt.style.background = 'rgba(0,0,0,0.05)';
          opt.style.fontWeight = '600';
          const activeLabel = opt.querySelector('span:last-child');
          if (activeLabel && !activeLabel.textContent.includes('✓')) {
            activeLabel.textContent += ' ✓';
          }

          const colorBtn = document.getElementById('btn-color-theme');
          if (val === 'jade') {
            crossfadeBackground('linear-gradient(135deg, #042f2e 0%, #0d9488 40%, #1d4ed8 80%, #0f172a 100%)', false);
            if (colorBtn) { colorBtn.style.borderColor = '#14b8a6'; colorBtn.style.color = '#0d9488'; }
          } else if (val === 'black') {
            crossfadeBackground('linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #334155 100%)', true);
            if (colorBtn) { colorBtn.style.borderColor = '#64748b'; colorBtn.style.color = '#475569'; }
          } else if (val === 'white') {
            crossfadeBackground('linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)', false);
            if (colorBtn) { colorBtn.style.borderColor = '#94a3b8'; colorBtn.style.color = '#64748b'; }
          }
        }
      });
    });

    // Role tabs
    const tabs = document.querySelectorAll('.role-tab');
    
    // Enforcement logic for signup prefixes
    const signupInput = document.getElementById('signup-username');
    const signupUniSelect = document.getElementById('signup-university');
    
    const updatePrefix = () => {
      if (!signupInput || !signupUniSelect) return;
      const uniId = parseInt(signupUniSelect.value) || 1;
      let prefix = '';
      if (currentRole === 'teacher') {
        prefix = uniId === 1 ? '101' : '10' + uniId;
      } else if (currentRole === 'admin') {
        prefix = 'admin';
      } else {
        prefix = '1000' + uniId;
      }
      if (currentRole !== 'admin' && !signupInput.value.startsWith(prefix)) {
        signupInput.value = prefix;
      }
    };

    const updateUniIcon = (selectId, iconId) => {
      const select = document.getElementById(selectId);
      const iconSpan = document.getElementById(iconId);
      if (!select || !iconSpan) return;
      const uniId = parseInt(select.value);
      const uni = Database.UNIVERSITIES.find(u => u.id === uniId);
      if (uni) {
        iconSpan.innerHTML = `<span style="font-weight: 700; color: var(--text-tertiary); font-size: 0.8rem;">${uni.shortName}</span>`;
      } else {
        iconSpan.innerHTML = `<i class="fas fa-university"></i>`;
      }
    };
    
    if (signupInput) {
      if (signupUniSelect) {
        signupUniSelect.addEventListener('change', () => {
          updatePrefix();
          updateUniIcon('signup-university', 'signup-uni-icon');
        });
      }
      signupInput.addEventListener('input', updatePrefix);
      updatePrefix(); // Initialize prefix on load
    }
    
    const loginUniSelect = document.getElementById('login-university');
    if (loginUniSelect) {
      loginUniSelect.addEventListener('change', () => {
        updateUniIcon('login-university', 'login-uni-icon');
      });
      // Delay initialization slightly to let universities populate
      setTimeout(() => {
        updateUniIcon('login-university', 'login-uni-icon');
        updateUniIcon('signup-university', 'signup-uni-icon');
      }, 100);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.closest('.role-tab').classList.add('active');
        currentRole = e.target.closest('.role-tab').dataset.role;
        
        const userInput = document.getElementById('login-username');
        
        const isEn = LoginView.currentLang === 'en';
        if (currentRole === 'teacher') {
          if (userInput) userInput.placeholder = isEn ? 'Enter teacher ID...' : 'Nhập mã giáo viên...';
          if (signupInput) {
            signupInput.placeholder = isEn ? 'Enter teacher ID (102...)' : 'Nhập mã giáo viên (102...)';
            updatePrefix();
          }
        } else {
          if (userInput) userInput.placeholder = isEn ? 'Enter student ID...' : 'Nhập mã sinh viên...';
          if (signupInput) {
            signupInput.placeholder = isEn ? 'Enter student ID (10001...)' : 'Nhập mã sinh viên (10001...)';
            updatePrefix();
          }
        }

        // Clear errors when switching roles
        this.hideInlineError('login-error-msg');
        this.hideInlineError('signup-error-msg');
      });
    });

    // Toggle Login/Signup
    const toggleSignupBtn = document.getElementById('toggle-signup-link');
    const toggleLoginBtn = document.getElementById('toggle-login-link');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (toggleSignupBtn && toggleLoginBtn) {
      toggleSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Slide out login, slide in signup
        loginForm.style.transition = 'opacity 0.2s, transform 0.2s';
        loginForm.style.opacity = '0';
        loginForm.style.transform = 'translateX(-16px)';
        setTimeout(() => {
          loginForm.style.display = 'none';
          loginForm.style.opacity = '';
          loginForm.style.transform = '';
          signupForm.style.display = 'block';
          signupForm.style.opacity = '0';
          signupForm.style.transform = 'translateX(16px)';
          signupForm.style.transition = 'opacity 0.2s, transform 0.2s';
          requestAnimationFrame(() => {
            signupForm.style.opacity = '1';
            signupForm.style.transform = 'translateX(0)';
          });
          // Focus on signup username
          const el = document.getElementById('signup-username');
          if (el) setTimeout(() => el.focus(), 250);
        }, 200);
        this.hideInlineError('login-error-msg');
        this.hideInlineError('signup-error-msg');
        updatePrefix();
      });

      toggleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.transition = 'opacity 0.2s, transform 0.2s';
        signupForm.style.opacity = '0';
        signupForm.style.transform = 'translateX(16px)';
        setTimeout(() => {
          signupForm.style.display = 'none';
          signupForm.style.opacity = '';
          signupForm.style.transform = '';
          loginForm.style.display = 'block';
          loginForm.style.opacity = '0';
          loginForm.style.transform = 'translateX(-16px)';
          loginForm.style.transition = 'opacity 0.2s, transform 0.2s';
          requestAnimationFrame(() => {
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'translateX(0)';
          });
          const el = document.getElementById('login-username');
          if (el) setTimeout(() => el.focus(), 250);
        }, 200);
        this.hideInlineError('login-error-msg');
        this.hideInlineError('signup-error-msg');
      });
    }

    // Input focus glow effect
    document.querySelectorAll('.input-group').forEach(group => {
      const input = group.querySelector('input');
      if (input) {
        input.addEventListener('focus', () => {
          group.style.borderColor = 'var(--primary-500)';
          group.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
        });
        input.addEventListener('blur', () => {
          group.style.borderColor = 'var(--border-color)';
          group.style.boxShadow = 'none';
        });
      }
    });

    // Toggle passwords (using innerHTML to fix FontAwesome duplicate SVG bug)
    const togglePass = document.getElementById('toggle-password');
    if (togglePass) {
      togglePass.addEventListener('click', () => {
        const passInput = document.getElementById('login-password');
        if (passInput.type === 'password') {
          passInput.type = 'text';
          togglePass.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
          passInput.type = 'password';
          togglePass.innerHTML = '<i class="fas fa-eye"></i>';
        }
      });
    }

    const toggleSignupPass = document.getElementById('toggle-signup-password');
    if (toggleSignupPass) {
      toggleSignupPass.addEventListener('click', () => {
        const passInput = document.getElementById('signup-password');
        if (passInput.type === 'password') {
          passInput.type = 'text';
          toggleSignupPass.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
          passInput.type = 'password';
          toggleSignupPass.innerHTML = '<i class="fas fa-eye"></i>';
        }
      });
    }

    // Signup Form Submit
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const name = document.getElementById('signup-name').value.trim();
        const password = document.getElementById('signup-password').value;
        const submitBtn = document.getElementById('btn-signup-submit');
        const universityId = document.getElementById('signup-university').value;

        // Clear previous error
        this.hideInlineError('signup-error-msg');
        
        // Manual validation
        let prefix = '';
        const uniId = parseInt(universityId) || 1;
        if (currentRole === 'teacher') prefix = uniId === 1 ? '101' : '10' + uniId;
        else if (currentRole === 'admin') prefix = 'admin';
        else prefix = '1000' + uniId;
        
        if (!username || (currentRole !== 'admin' && username === prefix)) {
          const roleName = currentRole === 'teacher' ? 'mã giáo viên' : 'mã sinh viên';
          this.showInlineError('signup-error-msg', 'signup-error-text', `Hãy điền ${roleName}!`);
          return;
        }
        if (!name) {
          this.showInlineError('signup-error-msg', 'signup-error-text', 'Hãy điền họ và tên!');
          return;
        }
        if (!password) {
          this.showInlineError('signup-error-msg', 'signup-error-text', 'Hãy tạo mật khẩu!');
          return;
        }

        // Require password validation (At least 7 chars, 1 uppercase, 1 number, 1 special char)
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;
        const isEn = LoginView.currentLang === 'en';
        if (!passRegex.test(password)) {
          this.showInlineError('signup-error-msg', 'signup-error-text', isEn ? 'Password must be at least 7 chars, 1 uppercase, 1 number, 1 special char!' : 'Mật khẩu tối thiểu 7 ký tự, gồm 1 chữ HOA, 1 số và 1 ký tự đặc biệt!');
          return;
        }

        const processingText = isEn ? 'Processing...' : 'Đang xử lý...';
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + processingText;
        submitBtn.disabled = true;

        setTimeout(() => {
          // Check duplicate in users
          const users = Database.users.getAll();
          const exists = users.find(u => u.username === username);

          if (exists) {
            this.showInlineError('signup-error-msg', 'signup-error-text', 
              isEn ? 'Account "' + username + '" already exists! Please use another ID or login.' : 'Tài khoản "' + username + '" đã tồn tại! Vui lòng sử dụng mã số khác hoặc đăng nhập.');
            submitBtn.innerHTML = isEn ? 'Sign up <i class="fas fa-user-plus" style="margin-left: 8px;"></i>' : 'Đăng ký <i class="fas fa-user-plus" style="margin-left: 8px;"></i>';
            submitBtn.disabled = false;
            
            // Shake card
            if (loginCard) {
              loginCard.style.animation = 'none';
              loginCard.offsetHeight;
              loginCard.style.animation = 'shakeError 0.5s ease';
            }
            return;
          }

          // Add to students/teachers collection using properly abstracted DB methods
          let targetId = null;
          if (currentRole === 'student') {
            const newStudent = Database.students.add({
              studentId: username,
              name: name,
              department: 'Công nghệ thông tin',
              status: 'active',
              createAccount: false,
              universityId: parseInt(universityId)
            });
            targetId = newStudent.id;
          } else if (currentRole === 'teacher') {
            const newTeacher = Database.teachers.add({
              teacherId: username,
              name: name,
              department: 'Công nghệ thông tin',
              position: 'Giảng viên',
              status: 'active',
              createAccount: false,
              universityId: parseInt(universityId)
            });
            targetId = newTeacher.id;
          }

          // Create the User Account
          Database.users.add({
            username: username,
            password: password,
            name: name,
            role: currentRole,
            linkedId: targetId,
            universityId: currentRole === 'admin' ? null : parseInt(universityId)
          });

          Utils.showToast(isEn ? 'Account created successfully! Redirecting to login...' : 'Tạo tài khoản thành công! Đang chuyển về đăng nhập...', 'success');
          
          setTimeout(() => {
            // Remove login container and re-init app fresh
            LoginView.destroy();
            window.location.hash = '#/login';
            App.init();
          }, 1000);
        }, 800);
      });
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('btn-login-submit');
        
        // Clear previous error
        this.hideInlineError('login-error-msg');

        const isEn = LoginView.currentLang === 'en';

        // Manual validation for empty fields
        if (!user) {
          const roleName = currentRole === 'teacher' ? (isEn ? 'Teacher ID' : 'mã giáo viên') : (isEn ? 'Student ID' : 'mã sinh viên');
          this.showInlineError('login-error-msg', 'login-error-text', isEn ? `Please enter ${roleName}!` : `Hãy điền ${roleName}!`);
          return;
        }
        if (!pass) {
          this.showInlineError('login-error-msg', 'login-error-text', isEn ? 'Please enter password!' : 'Hãy điền mật khẩu!');
          return;
        }

        // Show loading state
        const processingText = isEn ? 'Processing...' : 'Đang xử lý...';
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + processingText;
        submitBtn.disabled = true;
        
        setTimeout(() => {
          // First check if user exists at all
          const allUsers = Database.users.getAll();
          const userExists = allUsers.find(u => u.username === user);
          const universityId = document.getElementById('login-university').value;

          let result;
          
          if (currentRole === 'teacher' || currentRole === 'admin') {
            // Teacher / Admin tab
            result = Auth.login(user, pass, currentRole, universityId);
            // Fallback for admin if trying to login from teacher tab
            if (!result.success && currentRole === 'teacher') {
               result = Auth.login(user, pass, 'admin', universityId);
            }
          } else {
            // Student tab
            result = Auth.login(user, pass, 'student', universityId);
          }
          
          if (result.success) {
            const rememberMe = document.getElementById('remember-me').checked;
            if (rememberMe) {
               localStorage.setItem('unims_remembered', JSON.stringify({ user, pass, role: currentRole, uni: universityId }));
            } else {
               localStorage.removeItem('unims_remembered');
            }
            
            Utils.showToast(isEn ? 'Login successful!' : 'Đăng nhập thành công!', 'success');
            // Direct re-init: remove login UI → rebuild app with live session
            setTimeout(() => {
              LoginView.destroy();
              window.location.hash = '#/dashboard';
              App.init();
            }, 1000);
          } else {
            // Determine specific error message
            let errorMessage;
            if (!userExists) {
              errorMessage = isEn ? 'Account "' + user + '" does not exist. Please check again or create a new account.' : 'Tài khoản "' + user + '" không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc tạo tài khoản mới.';
            } else if (userExists.role !== currentRole && !(currentRole === 'teacher' && userExists.role === 'admin')) {
              errorMessage = isEn ? 'This account does not belong to the role "' + (currentRole === 'student' ? 'Student' : 'Teacher') + '". Please select the correct role.' : 'Tài khoản này không thuộc vai trò "' + (currentRole === 'student' ? 'Sinh viên' : 'Giáo viên') + '". Vui lòng chọn đúng vai trò.';
            } else {
              errorMessage = isEn ? 'Incorrect password. Please try again or click "Forgot password" to reset.' : 'Mật khẩu không chính xác. Vui lòng thử lại hoặc nhấn "Quên mật khẩu" để đặt lại.';
            }

            this.showInlineError('login-error-msg', 'login-error-text', errorMessage);
            
            submitBtn.innerHTML = isEn ? 'Login <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i>' : 'Đăng nhập <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i>';
            submitBtn.disabled = false;
            
            // Shake animation on error
            if (loginCard) {
              loginCard.style.animation = 'none';
              loginCard.offsetHeight; // trigger reflow
              loginCard.style.animation = 'shakeError 0.5s ease';
            }
          }
        }, 600);
      });
    }

    // Forgot password modal
    const forgotLink = document.getElementById('forgot-password-link');
    if (forgotLink) {
       forgotLink.addEventListener('click', (e) => {
         e.preventDefault();
         if (typeof ForgotPassword !== 'undefined') {
           ForgotPassword.show();
         } else {
           const isEnLang = LoginView.currentLang === 'en';
           Utils.showToast(isEnLang ? 'Feature is being updated!' : 'Tính năng đang được cập nhật!', 'info');
         }
       });
    }

    // Auto-fill Remember Me
    const remembered = localStorage.getItem('unims_remembered');
    if (remembered) {
      try {
        const data = JSON.parse(remembered);
        if (data.user) document.getElementById('login-username').value = data.user;
        if (data.pass) document.getElementById('login-password').value = data.pass;
        if (data.uni) document.getElementById('login-university').value = data.uni;
        document.getElementById('remember-me').checked = true;
        
        // Switch to the correct role tab if necessary
        if (data.role && data.role !== currentRole) {
           const targetTab = Array.from(tabs).find(t => t.getAttribute('data-role') === data.role);
           if (targetTab) targetTab.click();
        }
      } catch (e) {
        console.log('Error parsing remembered login');
      }
    }
  }
};
