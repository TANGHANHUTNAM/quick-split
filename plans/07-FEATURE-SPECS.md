# Feature Specs

## 1. Board header
### Mục tiêu
Cho phép user đặt tên board hiện tại.

### UI
- input tên board
- auto-save khi blur hoặc khi nhập
- fallback nếu rỗng: `Bảng chia tiền`

---

## 2. Members management
### Inputs
- member name

### Actions
- add member
- edit member
- delete member

### Validation
- required
- unique name
- trim

### Error cases
- duplicate name -> toast lỗi
- delete member đang được dùng -> toast lỗi

---

## 3. Expense form
### Fields
- title
- amount
- paidByMemberId
- participantMemberIds[]

### Interaction
- disable nếu chưa có member
- submit tạo expense mới
- khi edit thì prefill form
- có nút cancel edit

### Validation
- title required
- amount > 0
- paidBy required
- ít nhất 1 participant

---

## 4. Expense list
### Hiển thị
Mỗi item gồm:
- title
- amount đã format
- paid by
- participants count hoặc tên
- edit action
- delete action

### Empty state
- `Chưa có khoản chi nào`

---

## 5. Summary panel
### Nội dung
- total expenses
- số thành viên
- số khoản chi
- bảng summary từng người:
  - paid
  - owes
  - balance

### Visual rules
- balance dương: success badge
- balance âm: warning/danger badge
- balance 0: neutral badge

---

## 6. Settlement list
### Nội dung
Danh sách dòng:
- `{from} trả {to} {amount}`

### Empty state
- `Không có giao dịch cần thực hiện`

### Sorting
Có thể hiển thị theo thứ tự được tính ra từ algorithm

---

## 7. Copy result
### Hành vi
Tạo plain text để paste vào chat.

### Format gợi ý
```txt
Kết quả chia tiền - [Board Title]

Tổng chi: 1.250.000đ

Từng người:
- Nam: đã trả 800.000đ | phải chịu 300.000đ | chênh lệch +500.000đ
- An: đã trả 150.000đ | phải chịu 350.000đ | chênh lệch -200.000đ

Ai trả ai:
- An trả Nam 200.000đ
- Bình trả Nam 300.000đ
```

### Thành công
- hiện toast `Đã copy kết quả`

---

## 8. Clear all
### Hành vi
- mở confirm dialog
- confirm -> reset board
- remove storage key
- toast thành công

### Confirm copy
`Bạn có chắc muốn xóa board hiện tại và tạo bảng mới?`
