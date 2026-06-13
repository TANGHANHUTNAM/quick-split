# Data Model and Business Rules

## 1. Core entities

### 1.1 Board
```ts
type Board = {
  id: string
  title: string
  members: Member[]
  expenses: Expense[]
  createdAt: string
  updatedAt: string
}
```

### 1.2 Member
```ts
type Member = {
  id: string
  name: string
}
```

### 1.3 Expense
```ts
type Expense = {
  id: string
  title: string
  amount: number
  paidByMemberId: string
  participantMemberIds: string[]
  createdAt: string
  updatedAt: string
}
```

### 1.4 Computed summary
```ts
type MemberSummary = {
  memberId: string
  name: string
  paid: number
  owes: number
  balance: number // paid - owes
}
```

### 1.5 Settlement
```ts
type Settlement = {
  fromMemberId: string
  toMemberId: string
  amount: number
}
```

---

## 2. Business rules

### Rule 1: Tên board
- optional nhưng nên có default fallback: `Bảng chia tiền`
- trim whitespace

### Rule 2: Tên thành viên
- không rỗng
- trim whitespace
- không trùng nhau sau khi normalize lowercase + trim

### Rule 3: Khoản chi
- title không rỗng
- amount > 0
- paidByMemberId phải tồn tại trong members
- participantMemberIds.length >= 1
- mỗi participant id phải tồn tại trong members

### Rule 4: Split mode
MVP chỉ hỗ trợ:
- **equal split**

Cách tính:
- `share = amount / số participants`
- mỗi participant chịu đúng 1 share

### Rule 5: paidBy có thể không nằm trong participants
Cho phép.
Ví dụ: một người trả hộ cho nhóm nhưng bản thân không tham gia.
Khi đó:
- người trả vẫn được tính `paid += amount`
- nếu không nằm trong participants thì `owes += 0`

### Rule 6: Balance
- `balance = paid - owes`
- `balance > 0`: người này cần nhận tiền
- `balance < 0`: người này cần trả thêm
- `balance = 0`: cân bằng

### Rule 7: Settlement optimization
Dùng greedy algorithm:
1. tách danh sách creditors (`balance > 0`)
2. tách danh sách debtors (`balance < 0`)
3. match debtor với creditor cho đến khi hết nợ / hết dư
4. mỗi giao dịch lấy `min(abs(debt), credit)`

### Rule 8: Rounding
MVP dùng:
- nội bộ tính bằng number
- trước khi tạo settlement, normalize tới 2 decimal hoặc integer VND tùy quyết định UI
- nếu app chỉ dùng VND: ưu tiên round về integer đồng

**Khuyến nghị triển khai:** dùng integer VND trong toàn bộ input/output.

### Rule 9: Delete member
- không cho xóa member nếu member đang được dùng ở bất kỳ expense nào
- phải hiện lỗi hoặc toast giải thích

### Rule 10: Clear all
- reset board về empty state
- xóa localStorage key
