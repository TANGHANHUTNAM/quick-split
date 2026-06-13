# Persistence and Export

## 1. Persistence
### Yêu cầu
- chỉ lưu **1 board hiện tại**
- lưu bằng `localStorage`
- key gợi ý: `splitmate-current-board`

### Auto-save behavior
- save sau mỗi thay đổi state quan trọng:
  - board title
  - members
  - expenses

### App load behavior
- khi app mount:
  - nếu có data trong localStorage -> hydrate state
  - nếu không có -> tạo empty board mặc định

### Clear behavior
- xóa key localStorage
- reset về default empty board

## 2. Export image
### Yêu cầu
- export phần summary/result thành PNG
- file name gợi ý:
  - `splitmate-[board-slug].png`

### Nội dung export
- board title
- total expense
- member summary
- settlement list

### UX
- button `Export PNG`
- loading state ngắn khi đang export
- toast nếu thành công / lỗi

## 3. Export PDF
### Yêu cầu
- export cùng nội dung summary/result thành PDF
- file name gợi ý:
  - `splitmate-[board-slug].pdf`

### Cách triển khai khuyến nghị
- render block summary
- convert DOM to image
- insert image vào PDF
- auto download

## 4. Export target element
Tạo một `ref` riêng cho summary export container.
Không export toàn page để tránh UI thừa.

## 5. Copy result
Ngoài export file, luôn có copy text vì đây là use case rất thực tế.
