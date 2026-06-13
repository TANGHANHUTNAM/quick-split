# UI UX Guidelines

## 1. Design principles
- rõ ràng hơn là flashy
- ít bước thao tác
- form dễ nhập
- kết quả dễ đọc
- mobile-first, responsive tốt trên desktop
- màu nhẹ, độ tương phản tốt, không gây mỏi mắt

## 2. Visual tone
- cảm giác: sạch, thân thiện, dễ dùng, hiện đại
- tránh quá nhiều màu chói
- dùng màu chính cho CTA và highlight logic

## 3. Recommended color palette
### Primary
- Primary 600: `#2563EB`
- Primary 500: `#3B82F6`
- Primary 50: `#EFF6FF`

### Success
- `#16A34A`

### Warning
- `#D97706`

### Danger
- `#DC2626`

### Neutral
- Background: `#F8FAFC`
- Card: `#FFFFFF`
- Border: `#E2E8F0`
- Text primary: `#0F172A`
- Text secondary: `#475569`

## 4. Typography
- heading rõ, đậm vừa phải
- body text 14-16px
- số tiền nên lớn và dễ scan
- tên thành viên không dùng font quá stylized

## 5. Layout structure
### Mobile
1. Header / Board title
2. Members section
3. Expense form
4. Expense list
5. Summary
6. Action bar

### Desktop
- grid 2 cột
- cột trái: board info + members + expense form + expense list
- cột phải: summary + settlement + export actions

## 6. Components cần có
- top header
- input
- textarea optional
- select
- checkbox list hoặc pill selector cho participants
- button
- secondary button
- destructive button
- card
- badge
- divider
- modal / confirm dialog
- toast

## 7. UX decisions
### Thành viên
- thêm nhanh bằng input + nút add
- mỗi member row có edit và delete

### Khoản chi
- form phải ngắn gọn
- participants chọn bằng checkbox chips hoặc list dễ nhìn
- edit expense inline hoặc mở modal, miễn thao tác đơn giản

### Summary
- phần này là khu vực quan trọng nhất
- cần ưu tiên hiển thị:
  - total expense
  - per-member summary
  - settlement list

### Empty states
- chưa có thành viên: nhắc thêm thành viên trước
- chưa có khoản chi: hiển thị placeholder dễ hiểu
- chưa có settlement: hiển thị “chưa có dữ liệu để tính”

## 8. Accessibility
- button có focus state rõ
- input có label
- icon button phải có aria-label
- không chỉ truyền meaning bằng màu sắc
