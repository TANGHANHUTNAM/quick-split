# MVP Scope

## 1. In scope

### 1.1 Board hiện tại
- Tạo và quản lý đúng **1 board chia tiền hiện tại**
- Có field tên board
- Có thể clear all để bắt đầu board mới

### 1.2 Thành viên
- thêm thành viên
- sửa tên thành viên
- xóa thành viên

### 1.3 Khoản chi
Mỗi khoản chi gồm:
- id
- title
- amount
- paidBy
- participantIds[]
- createdAt (optional cho sort UI)

Cho phép:
- thêm khoản chi
- sửa khoản chi
- xóa khoản chi
- xem danh sách khoản chi

### 1.4 Tính toán
- tổng tiền mỗi người đã trả
- tổng tiền mỗi người phải chịu
- balance của mỗi người
- danh sách settlement: ai trả ai bao nhiêu

### 1.5 Kết quả
- summary từng người
- danh sách giao dịch cuối
- tổng chi tiêu của board

### 1.6 Tiện ích
- copy kết quả text
- export PNG
- export PDF
- lưu board hiện tại bằng localStorage

## 2. Out of scope
- share URL
- account system
- backend API
- history / archive
- split mode nâng cao
- currency exchange
- upload avatar
- dark mode toggle riêng nếu làm trễ timeline

## 3. Định nghĩa hoàn thành MVP
MVP được xem là xong khi:
1. User có thể tạo board và nhập dữ liệu mà không lỗi logic cơ bản
2. User có thể tính đúng kết quả cho split đều
3. Reload trang không mất board hiện tại
4. User có thể export PNG/PDF từ summary
5. Clear all xóa sạch board hiện tại
