# 🎓 UniMS

**Hệ thống quản lý đại học và sinh viên tự lưu trữ (Self-hosted)**  
Phân quyền mạnh mẽ · Dữ liệu của bạn · Trợ lý AI · Vanilla JS

**Hệ thống quản lý đại học mà bạn thực sự sở hữu.**

Lên kế hoạch học tập, quản lý điểm số, và theo dõi tiến độ sinh viên qua từng học kỳ — ngay trên trình duyệt, siêu nhanh và mượt mà. Đăng nhập phân quyền mạnh mẽ, không cần cài đặt phức tạp. Tất cả gói gọn trong một lệnh `python server.py`.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Self-hosted](https://img.shields.io/badge/self--hosted-%F0%9F%8F%A0-blue.svg)](#quick-start-self-host) [![UI](https://img.shields.io/badge/UI-Vanilla%20JS-yellow.svg)](#features) [![Backend](https://img.shields.io/badge/backend-Python%20Server-3776AB.svg?logo=python)](#quick-start-self-host) [![Telemetry](https://img.shields.io/badge/telemetry-none-ff69b4.svg)](#why)

*Dashboard* — **Quản lý điểm số chi tiết** — **AI Chatbot hỗ trợ**

---

## Why

Phần lớn các hệ thống quản lý đại học hiện nay cồng kềnh, giao diện cứng nhắc, tốc độ tải chậm và khó tùy biến. **UniMS là một thái cực ngược lại: nó chạy trực tiếp trên máy của bạn, dữ liệu nằm trong quyền kiểm soát của bạn, và siêu nhẹ.**

Hệ thống vẫn mang lại cảm giác hiện đại tuyệt đối — hỗ trợ các vi tương tác (micro-interactions), hoạt ảnh (animations) mượt mà, AI Chatbot nổi, và thiết kế responsive thích ứng từ điện thoại đến màn hình lớn.

## Features

Toàn bộ hệ thống được chia thành các phân hệ chức năng chuyên biệt, đáp ứng đầy đủ nghiệp vụ quản lý sinh viên:

### 🔐 Xác thực & Hệ thống (Auth & System)

- Đăng nhập đa vai trò (Admin, Giáo viên, Sinh viên) với luồng điều hướng UI thông minh (Role-based Routing).
- Giao diện đăng nhập hiện đại với 3 chủ đề màu (Jade, Black, White).
- Quên mật khẩu & Đăng ký tài khoản dành cho người dùng mới.

### 📊 Bảng điều khiển (Dashboard)

- **Thống kê tổng quan:** Hiển thị tức thì tổng số sinh viên, giáo viên, lớp học và doanh thu.
- **Biểu đồ trực quan (Chart.js):** Biểu diễn tiến độ học tập, phổ điểm, trạng thái lớp học.
- **Cá nhân hóa theo Role:** Admin nắm bắt tổng quan toàn trường; Sinh viên theo dõi tín chỉ tích lũy & điểm GPA.

### 👥 Quản lý Người dùng (User Management)

- Xem danh sách, tìm kiếm, lọc nhanh thông tin Sinh viên & Giáo viên.
- Thêm/Sửa/Xóa (CRUD) hồ sơ trực tiếp trên trình duyệt.
- Hỗ trợ phân trang (Pagination) mượt mà cho bảng dữ liệu lớn.

### 📚 Đào tạo & Điểm số (Academic & Grading)

- **Quản lý Môn học:** Tạo lớp học mới, phân công giáo viên giảng dạy.
- **Nhập điểm nhanh (Spreadsheet-like):** Giao diện bảng tính giúp giáo viên/Admin nhập điểm hàng loạt nhanh chóng, không độ trễ.
- **Tra cứu điểm:** Sinh viên tra cứu điểm theo học kỳ dễ dàng.

### 🎫 Trung tâm Hỗ trợ (Helpdesk) & Tiện ích

- **Quản lý Ticket:** Sinh viên/Giáo viên tạo phiếu yêu cầu (đính kèm file tối đa 10MB). Admin duyệt và phản hồi.
- **AI Chatbot Assistant:** Bong bóng Chatbot dạng Pill-shape nổi bật, luôn sẵn sàng giải đáp thắc mắc tự động.
- **Workshop/Sự kiện:** Theo dõi và đăng ký tham gia hội thảo.
- **Hồ sơ cá nhân:** Cập nhật thông tin, đổi mật khẩu an toàn, tùy biến giao diện đa ngôn ngữ (Tiếng Việt/Anh).

## Quick start (self-host)

Bạn chỉ cần có **Python 3** được cài đặt trên máy. Không cần Docker, Node.js hay thiết lập Database phức tạp.

```bash
git clone https://github.com/HenryTechNA/StudentManagement33.git
cd StudentManagement33

# Khởi chạy server siêu nhẹ tích hợp sẵn
python server.py
```

Mở trình duyệt tại địa chỉ [http://localhost:8000](http://localhost:8000).
Ngay khi mở lên, cơ sở dữ liệu mẫu (Seed Data) sẽ tự động được khởi tạo để bạn có thể sử dụng ngay lập tức. Cực kỳ tiện lợi để phát triển và thử nghiệm UI/UX.

## Configuration

Các tài khoản thử nghiệm (Mock Accounts) đã được cấu hình sẵn trong file `.env`. Bạn có thể sử dụng các tài khoản sau để đăng nhập:

| Vai trò | Username | Password |

|---|---|---|
| **Admin** | `sysroot_unims` | `Tr!@ngUMS#2026$Sec` |
| **Giáo viên** | `1011` | `gv1011` |
| **Sinh viên** | `100011` | `sv100011` |

> *Lưu ý: Hệ thống định tuyến đăng nhập thông minh — bạn có thể nhập tài khoản Admin vào tab "Giáo viên", ứng dụng sẽ tự động phân loại và chuyển bạn vào đúng phân hệ.*

## Roadmap

Dự án hiện đang liên tục được cải thiện, hoan nghênh các đóng góp (PRs):

### Đã hoàn thiện (Done)

- [x] Thiết kế lại UI/UX chuẩn hiện đại, bổ sung Micro-interactions (hover, ripple, focus glow).
- [x] Tích hợp AI Chatbot dạng Pill-shape gọn gàng, thu hút.
- [x] Tính năng "Cuộn lên đầu trang" & "Thanh tiến trình đọc" cho trang Review.
- [x] Đồng bộ icon trường học & giao diện bảng điểm chuyên nghiệp.
- [x] Xây dựng kiến trúc tĩnh (Client-side) độc lập, hoạt động ngay mà không cần setup Backend.

### Đang phát triển / Lên kế hoạch (To-Do)

- [ ] Xây dựng hoàn chỉnh luồng Quản lý học phí & Trạng thái thanh toán (Còn nợ/Đã nộp).
- [ ] Chuyển đổi Database từ LocalStorage sang REST API thực tế (bằng Django/Node.js) cho môi trường Production.
- [ ] Cải thiện thao tác đăng ký lớp học cho Sinh viên với luồng kiểm tra điều kiện tiên quyết.
- [ ] Triển khai ứng dụng dưới dạng PWA (Progressive Web App) cài đặt được trên điện thoại.

---
*Project maintained by **HenryTechNA**. Reach out on GitHub if you are interested!*
