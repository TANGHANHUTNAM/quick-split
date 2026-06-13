# Acceptance Criteria

## 1. Board
- user có thể nhập và sửa tên board
- tên board được lưu sau reload
- nếu không nhập tên, app vẫn hoạt động với tên fallback

## 2. Members
- user có thể thêm member mới
- user không thể thêm member trùng tên
- user có thể sửa tên member
- user không thể xóa member đang được dùng trong expense

## 3. Expenses
- user không thể tạo expense nếu chưa có member
- user có thể tạo expense hợp lệ
- user có thể sửa expense
- user có thể xóa expense
- amount luôn phải lớn hơn 0
- phải có ít nhất 1 participant

## 4. Calculation
- tổng `paid` của tất cả member bằng tổng amount của toàn bộ expenses
- tổng `owes` của tất cả member bằng tổng amount của toàn bộ expenses
- tổng `balance` của tất cả member xấp xỉ 0
- settlement list làm triệt tiêu toàn bộ debt/credit sau rounding strategy đã chọn

## 5. Persistence
- reload trang vẫn còn board hiện tại
- clear all xóa board hiện tại khỏi localStorage

## 6. Copy / Export
- copy result tạo đúng text format
- export PNG tải được file
- export PDF tải được file
- export không chứa control/button thừa ngoài khu vực summary

## 7. UX
- app dùng tốt trên mobile
- app có empty state rõ ràng
- action nguy hiểm có confirm
- có feedback thành công/thất bại bằng toast hoặc inline message
