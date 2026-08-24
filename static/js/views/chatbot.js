// chatbot.js
// Trợ lý AI (Chatbot View) với tích hợp Gemini/GPT

const CHATBOT_KB = {
  greetings: {
    keywords: ['xin chào', 'hello', 'hi', 'chào', 'hey', 'alo'],
    vi: 'Xin chào! Tôi là trợ lý AI của UniMS. Tôi có thể giúp bạn:\n• Tra cứu thông tin sinh viên\n• Giải đáp thắc mắc về quy chế\n• Hướng dẫn sử dụng hệ thống\nHãy hỏi tôi bất cứ điều gì!',
    en: 'Hello! I am the UniMS AI assistant. I can help you with:\n• Student information lookup\n• Explaining regulations\n• System navigation\nAsk me anything!',
  },
  student_lookup: {
    keywords: ['tra cứu', 'tìm sinh viên', 'look up', 'find student', 'search student', 'thông tin sinh viên', 'student info'],
    vi: 'Để tra cứu sinh viên:\n1. Vào menu "Sinh viên" ở sidebar\n2. Sử dụng thanh tìm kiếm phía trên\n3. Bạn có thể tìm theo mã SV, tên, hoặc email\n\nBạn cũng có thể lọc theo khoa hoặc trạng thái.',
    en: 'To look up a student:\n1. Go to "Students" menu in the sidebar\n2. Use the search bar at the top\n3. You can search by ID, name, or email\n\nYou can also filter by department or status.',
  },
  grades: {
    keywords: ['điểm', 'grade', 'score', 'mark', 'bảng điểm', 'xem điểm', 'nhập điểm', 'transcript'],
    vi: 'Về quản lý điểm:\n• Vào "Bảng điểm" để xem/nhập điểm\n• Điểm hệ 10 = Giữa kỳ×30% + Cuối kỳ×50% + Bài tập×20%\n• Điểm chữ: A (≥8.5), B+ (≥8.0), B (≥7.0), C+ (≥6.5), C (≥5.5), D+ (≥5.0), D (≥4.0), F (<4.0)',
    en: 'About grade management:\n• Go to "Grades" to view/enter grades\n• Base 10 grade = Midterm×30% + Final×50% + Assignment×20%\n• Letter grades: A (≥8.5), B+ (≥8.0), B (≥7.0), C+ (≥6.5), C (≥5.5), D+ (≥5.0), D (≥4.0), F (<4.0)',
  },
  add_student: {
    keywords: ['thêm sinh viên', 'add student', 'đăng ký', 'register', 'enroll', 'nhập học'],
    vi: 'Để thêm sinh viên mới:\n1. Vào "Sinh viên" ở sidebar\n2. Click nút "Thêm sinh viên"\n3. Điền đầy đủ thông tin\n4. Click "Lưu" để hoàn tất',
    en: 'To add a new student:\n1. Go to "Students" in the sidebar\n2. Click the "Add Student" button\n3. Fill in the required information\n4. Click "Save" to finish',
  },
  schedule: {
    keywords: ['lịch', 'thời khoá biểu', 'schedule', 'timetable', 'lịch học'],
    vi: 'Xem lịch học:\n• Vào "Lớp học" để xem danh sách lớp và lịch\n• Mỗi lớp có thông tin: lịch học, phòng, giáo viên',
    en: 'View class schedule:\n• Go to "Classes" to see the list of classes and schedules\n• Each class has info: time, room, teacher',
  },
  help_bug: {
    keywords: ['lỗi', 'bug', 'báo cáo', 'report', 'hỗ trợ', 'support', 'giúp đỡ', 'help'],
    vi: 'Nếu bạn gặp lỗi:\n1. Vào "Hỗ trợ" ở sidebar\n2. Click "Tạo phiếu hỗ trợ"\n3. Mô tả chi tiết lỗi, chọn mức độ nghiêm trọng\n4. Admin sẽ xem xét và phản hồi',
    en: 'If you encounter a bug:\n1. Go to "Helpdesk" in the sidebar\n2. Click "Create Ticket"\n3. Describe the issue in detail, select severity\n4. Admins will review and respond',
  },
  regulations: {
    keywords: ['quy chế', 'quy định', 'regulation', 'rule', 'policy', 'chính sách'],
    vi: 'Một số quy chế cơ bản:\n• Điểm hệ 4 ≥ 1.0 (D) để qua môn\n• Sinh viên có điểm hệ 4 < 1.0 liên tục sẽ bị cảnh báo học vụ',
    en: 'Some basic regulations:\n• Base 4 grade ≥ 1.0 (D) to pass a course\n• Students with base 4 grade < 1.0 continuously will face academic warning',
  },
  thanks: {
    keywords: ['cảm ơn', 'thank', 'thanks', 'tks', 'thank you'],
    vi: 'Không có gì! Tôi luôn sẵn sàng hỗ trợ bạn. Nếu cần giúp đỡ thêm, cứ hỏi nhé! 😊',
    en: 'You are welcome! I am always ready to help. If you need anything else, just ask! 😊',
  },
  goodbye: {
    keywords: ['tạm biệt', 'bye', 'goodbye', 'thoát', 'exit'],
    vi: 'Tạm biệt! Chúc bạn học tập và làm việc hiệu quả! 👋',
    en: 'Goodbye! Wishing you an effective study and work session! 👋',
  },
  default: {
    vi: 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Hãy thử hỏi về:\n• Tra cứu sinh viên\n• Quản lý điểm\n• Lịch học\n• Quy chế học tập\n• Báo cáo lỗi',
    en: 'Sorry, I don\'t understand your question. Try asking about:\n• Student lookup\n• Grade management\n• Class schedule\n• Study regulations\n• Bug reporting',
  }
};

const ChatbotView = {
  isTyping: false,

  render() {
    const container = document.getElementById('main-content');
    container.innerHTML = this.getHTML();
    this.attachEvents();
    this.loadHistory();
  },

  getHTML() {
    const settings = Database.settings.get();
    const isAdmin = Auth.isAdmin();

    return `
      <div class="page-header">
        <div class="page-title-section">
          <h1 class="page-title">${t('chatbot_title')}</h1>
          <p class="page-subtitle">${t('chatbot_subtitle')}</p>
        </div>
        <div class="page-actions" style="display: flex; gap: 0.5rem;">
          ${isAdmin ? `
            <button class="btn btn-secondary" id="btn-ai-settings">
              <i class="fas fa-cog"></i> Cài đặt AI
            </button>
          ` : ''}
          <button class="btn btn-ghost text-danger border-danger" id="btn-clear-chat">
            <i class="fas fa-trash"></i> ${t('clear_history')}
          </button>
        </div>
      </div>

      <!-- AI Settings Modal -->
      <div class="modal-overlay" id="ai-settings-modal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Cài đặt API Trí tuệ Nhân tạo</h3>
            <button class="btn-icon" id="btn-close-ai-settings"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nhà cung cấp AI</label>
              <select class="form-control" id="ai-provider">
                <option value="simulated" ${settings.aiProvider === 'simulated' ? 'selected' : ''}>Mô phỏng (Offline)</option>
                <option value="gemini" ${settings.aiProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                <option value="gpt" ${settings.aiProvider === 'gpt' ? 'selected' : ''}>OpenAI GPT-4</option>
              </select>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>API Key</label>
              <input type="password" class="form-control" id="ai-api-key" value="${settings.aiApiKey || ''}" placeholder="Nhập API key của bạn...">
              <small class="text-text-tertiary">API Key được lưu trữ an toàn trong LocalStorage của trình duyệt.</small>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <button class="btn btn-ghost" id="btn-cancel-ai-settings">Hủy</button>
            <button class="btn btn-primary" id="btn-save-ai-settings">Lưu cài đặt</button>
          </div>
        </div>
      </div>

      <div class="card h-[calc(100vh-220px)] flex flex-col relative" style="height: calc(100vh - 220px); display: flex; flex-direction: column;">
        <!-- Header -->
        <div class="card-header flex items-center gap-3 bg-bg-tertiary border-b border-border-color p-4" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="avatar avatar-md bg-primary-500 text-white flex-center rounded-full" style="display:flex; justify-content:center; align-items:center; width: 40px; height: 40px; border-radius: 50%; background: var(--primary-500); color: white;">
              <i class="fas fa-robot"></i>
            </div>
            <div>
              <h3 class="font-bold text-text-primary m-0" style="margin:0; font-weight: 600;">UniMS AI Assistant</h3>
              <span class="text-xs text-success flex items-center gap-1" style="font-size: 0.75rem; display: flex; align-items: center; gap: 4px; color: var(--success);">
                <span style="display:inline-block; width:8px; height:8px; background:var(--success); border-radius:50%;"></span> Online (${settings.aiProvider === 'simulated' ? 'Offline KB' : settings.aiProvider.toUpperCase()})
              </span>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-messages flex-1 overflow-y-auto p-4 flex flex-col gap-4" id="chat-messages" style="flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 1rem;">
          <!-- Messages will be injected here -->
        </div>

        <!-- Typing Indicator -->
        <div class="typing-indicator hidden px-4 py-2" id="typing-indicator" style="display: none;">
          <div class="chat-message bot flex gap-2" style="display: flex; gap: 0.5rem;">
            <div class="avatar avatar-sm bg-primary-500 text-white flex-center rounded-full" style="width: 32px; height: 32px; display:flex; justify-content:center; align-items:center; flex-shrink: 0; border-radius: 50%; background: var(--primary-500); color: white;">
              <i class="fas fa-robot text-xs"></i>
            </div>
            <div class="chat-bubble p-3 rounded-lg" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-top-left-radius: 0;">
              <div style="display: flex; gap: 4px;">
                <div style="width:6px;height:6px;background:var(--text-tertiary);border-radius:50%;animation:typing 1.4s infinite ease-in-out 0.2s;"></div>
                <div style="width:6px;height:6px;background:var(--text-tertiary);border-radius:50%;animation:typing 1.4s infinite ease-in-out 0.4s;"></div>
                <div style="width:6px;height:6px;background:var(--text-tertiary);border-radius:50%;animation:typing 1.4s infinite ease-in-out 0.6s;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input border-t border-border-color p-4 bg-bg-secondary flex gap-2" style="display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border-color);">
          <input type="text" id="chat-input" class="form-control" placeholder="${t('type_message')}" style="flex: 1;">
          <button class="btn btn-primary" id="btn-send-chat">
            <i class="fas fa-paper-plane"></i> <span class="hidden-mobile" style="margin-left: 8px;">${t('send')}</span>
          </button>
        </div>
      </div>
      
      <style>
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
        }
        #ai-settings-modal {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 1000;
          display: none; align-items: center; justify-content: center;
        }
        #ai-settings-modal.show { display: flex; }
      </style>
    `;
  },

  attachEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('btn-send-chat');
    const clearBtn = document.getElementById('btn-clear-chat');

    const handleSend = () => {
      const text = input.value.trim();
      if (text && !this.isTyping) {
        this.addMessage('user', text);
        input.value = '';
        this.processBotResponse(text);
      }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    clearBtn.addEventListener('click', () => {
      if(confirm(t('confirm_clear_chat') || 'Bạn có chắc muốn xóa lịch sử chat?')) {
        localStorage.removeItem('unims_chat_history');
        document.getElementById('chat-messages').innerHTML = '';
        this.loadHistory(); // Reloads welcome msg
      }
    });

    // AI Settings Events
    const settingsBtn = document.getElementById('btn-ai-settings');
    const modal = document.getElementById('ai-settings-modal');
    
    if (settingsBtn && modal) {
      settingsBtn.addEventListener('click', () => modal.classList.add('show'));
      document.getElementById('btn-close-ai-settings').addEventListener('click', () => modal.classList.remove('show'));
      document.getElementById('btn-cancel-ai-settings').addEventListener('click', () => modal.classList.remove('show'));
      
      document.getElementById('btn-save-ai-settings').addEventListener('click', () => {
        const provider = document.getElementById('ai-provider').value;
        const key = document.getElementById('ai-api-key').value.trim();
        
        Database.settings.save({ aiProvider: provider, aiApiKey: key });
        modal.classList.remove('show');
        const isEn = typeof App !== 'undefined' && App.currentLang === 'en';
        Utils.showToast(isEn ? 'AI settings saved' : 'Đã lưu cấu hình AI', 'success');
        this.render(); // Re-render to update header
      });
    }
  },

  loadHistory() {
    const history = JSON.parse(localStorage.getItem('unims_chat_history') || '[]');
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    if (history.length === 0) {
      // Show welcome message
      this.addMessage('bot', t('chatbot_welcome'), false);
    } else {
      history.forEach(msg => {
        this.appendMessageHTML(msg.sender, msg.text, msg.timestamp);
      });
      this.scrollToBottom();
    }
  },

  saveHistory(sender, text, timestamp) {
    const history = JSON.parse(localStorage.getItem('unims_chat_history') || '[]');
    history.push({ sender, text, timestamp });
    // Keep last 50 messages
    if (history.length > 50) history.shift();
    localStorage.setItem('unims_chat_history', JSON.stringify(history));
  },

  addMessage(sender, text, save = true) {
    const timestamp = new Date().toISOString();
    this.appendMessageHTML(sender, text, timestamp);
    if (save) this.saveHistory(sender, text, timestamp);
    this.scrollToBottom();
  },

  appendMessageHTML(sender, text, timestamp) {
    const container = document.getElementById('chat-messages');
    const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Parse Markdown basic (bold, line breaks) for bot
    let formattedText = text;
    if (sender === 'bot') {
       formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
       formattedText = formattedText.replace(/\n/g, '<br>');
    }
    
    let html = '';
    if (sender === 'user') {
      html = `
        <div class="chat-message user" style="display:flex; flex-direction:column; align-items:flex-end; gap:0.25rem;">
          <div class="chat-bubble" style="background:var(--primary-500); color:white; border-radius:0.5rem; border-bottom-right-radius:0; max-width:80%; padding:0.75rem; line-height: 1.5; font-size: 0.95rem;">
            ${formattedText}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">${timeStr}</span>
        </div>
      `;
    } else {
      html = `
        <div class="chat-message bot" style="display:flex; gap:0.5rem; align-items: flex-start;">
          <div style="width:32px; height:32px; display:flex; justify-content:center; align-items:center; flex-shrink:0; border-radius: 50%; background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--primary-500);">
            <i class="fas fa-robot text-xs"></i>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.25rem; max-width:80%;">
            <div class="chat-bubble" style="background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:0.5rem; border-top-left-radius:0; padding:0.75rem; line-height: 1.5; font-size: 0.95rem;">
              ${formattedText}
            </div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">${timeStr}</span>
          </div>
        </div>
      `;
    }
    
    container.insertAdjacentHTML('beforeend', html);
  },

  scrollToBottom() {
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
  },

  async processBotResponse(userText) {
    const isEn = (typeof Database !== 'undefined' && Database.settings.get().language === 'en') || (localStorage.getItem('unims_settings') && JSON.parse(localStorage.getItem('unims_settings')).language === 'en');
    
    // Check 100 messages/day limit
    const today = new Date().toISOString().split('T')[0];
    let chatCount = parseInt(localStorage.getItem('unims_main_chat_count') || '0');
    let chatDate = localStorage.getItem('unims_main_chat_date');
    if (chatDate !== today) {
        chatCount = 0;
        localStorage.setItem('unims_main_chat_date', today);
    }
    if (chatCount >= 100) {
        const errorMsg = isEn ? 'You have reached the limit of 100 chats per day.' : 'Bạn đã đạt giới hạn 100 lần chat trong 1 ngày.';
        this.addMessage('bot', errorMsg);
        return;
    }
    chatCount++;
    localStorage.setItem('unims_main_chat_count', chatCount);

    this.isTyping = true;
    document.getElementById('typing-indicator').style.display = 'flex';
    this.scrollToBottom();

    const settings = Database.settings.get();
    let responseText = '';

    try {
      if (settings.aiProvider === 'gemini' && settings.aiApiKey) {
        responseText = await this.callGeminiAPI(userText, settings.aiApiKey, isEn);
      } else if (settings.aiProvider === 'gpt' && settings.aiApiKey) {
        responseText = await this.callGPTAPI(userText, settings.aiApiKey, isEn);
      } else {
        // Fallback to simulated offline KB
        responseText = await this.getSimulatedAnswer(userText, isEn);
      }
    } catch (e) {
      console.error("AI API Error:", e);
      responseText = isEn ? "Sorry, an error occurred while connecting to the AI server. Please check your API key or network connection." : "Xin lỗi, đã có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng kiểm tra lại API key hoặc kết nối mạng.";
    }
    
    document.getElementById('typing-indicator').style.display = 'none';
    this.isTyping = false;
    this.addMessage('bot', responseText);
  },

  async callGeminiAPI(text, apiKey, isEn) {
    const context = this.buildContext();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const langPrompt = isEn ? 'Answer in English.' : 'Trả lời bằng tiếng Việt.';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Bạn là trợ lý AI của hệ thống quản lý đại học UniMS. ${langPrompt} Hãy ngắn gọn, súc tích. Dữ liệu hệ thống:\n${context}\n\nCâu hỏi của người dùng: ${text}` }]
        }]
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  },

  async callGPTAPI(text, apiKey, isEn) {
    const context = this.buildContext();
    const langPrompt = isEn ? 'Answer shortly in English.' : 'Trả lời ngắn gọn bằng tiếng Việt.';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Bạn là trợ lý AI của UniMS. ${langPrompt} Dữ liệu:\n${context}` },
          { role: "user", content: text }
        ]
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.choices[0].message.content;
  },

  buildContext() {
    // Trích xuất 1 phần dữ liệu để AI có context thực tế (không quá nhiều để tránh vượt limit token)
    const stats = {
      students: Database.students.count(),
      teachers: Database.teachers.count(),
      classes: Database.classes.count()
    };
    return `Hệ thống có ${stats.students} sinh viên, ${stats.teachers} giáo viên, ${stats.classes} lớp học.`;
  },

  getSimulatedAnswer(input, isEn) {
    return new Promise(resolve => {
      setTimeout(() => {
        const text = input.toLowerCase();
        let bestMatchKey = null;
        let maxMatches = 0;

        for (const [key, data] of Object.entries(CHATBOT_KB)) {
          if (key === 'default') continue;
          let matches = 0;
          data.keywords.forEach(kw => {
            if (text.includes(kw)) matches++;
          });
          if (matches > maxMatches) {
            maxMatches = matches;
            bestMatchKey = key;
          }
        }

        const langKey = isEn ? 'en' : 'vi';
        if (bestMatchKey) {
          resolve(CHATBOT_KB[bestMatchKey][langKey]);
        } else {
          resolve(CHATBOT_KB.default[langKey]);
        }
      }, 800); // Simulate network delay
    });
  }
};
