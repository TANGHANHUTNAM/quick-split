# User Stories and Flows

## 1. User stories

### Story 1: Tạo board
Là một người dùng, tôi muốn nhập tên board để phân biệt lần chia tiền hiện tại.

### Story 2: Quản lý thành viên
Là một người dùng, tôi muốn thêm, sửa, xóa thành viên để phản ánh đúng nhóm của mình.

### Story 3: Ghi nhận khoản chi
Là một người dùng, tôi muốn thêm khoản chi với người trả và danh sách người tham gia để hệ thống biết tiền đó áp dụng cho ai.

### Story 4: Tính tiền
Là một người dùng, tôi muốn bấm một lần và thấy ngay ai trả ai bao nhiêu.

### Story 5: Lưu trạng thái hiện tại
Là một người dùng, tôi muốn reload trang mà không mất dữ liệu đang làm dở.

### Story 6: Gửi kết quả
Là một người dùng, tôi muốn copy hoặc export kết quả để gửi cho nhóm.

### Story 7: Tạo board mới
Là một người dùng, tôi muốn clear all để bắt đầu một lần chia tiền mới.

---

## 2. Primary flow

### Flow A: Happy path
1. User mở app
2. User nhập tên board
3. User thêm 2+ thành viên
4. User thêm 1+ khoản chi
5. User bấm calculate hoặc hệ thống tự tính theo state hiện tại
6. User xem summary và settlement
7. User copy kết quả hoặc export
8. User clear all nếu muốn tạo board mới

### Flow B: Edit expense
1. User xem danh sách khoản chi
2. User chọn edit
3. User sửa amount hoặc participants
4. App cập nhật ngay kết quả

### Flow C: Clear board
1. User bấm clear all
2. App hiện confirm dialog
3. User confirm
4. App reset state + remove localStorage key
5. App về trạng thái board mới

---

## 3. Edge flows

### Edge 1: Chưa có thành viên mà thêm khoản chi
- chặn thao tác hoặc disable form
- hiển thị helper text: cần thêm thành viên trước

### Edge 2: Khoản chi không có participant
- không cho submit
- hiển thị lỗi rõ ràng

### Edge 3: Xóa thành viên đang được dùng
Có 2 lựa chọn:
- lựa chọn A: chặn xóa nếu member đang được dùng trong expense
- lựa chọn B: cho xóa nhưng đồng thời xóa các expense liên quan

**Quyết định cho MVP:** dùng **A** để an toàn dữ liệu

### Edge 4: Chia lẻ tiền
- hệ thống dùng rounding strategy nhất quán
- hiển thị số tiền đã format
