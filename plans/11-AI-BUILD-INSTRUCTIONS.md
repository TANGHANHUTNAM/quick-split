# AI Build Instructions

Tài liệu này dùng để giao cho AI coding agent hoặc developer.

## 1. Mục tiêu
Build một mini app **SplitMate** theo đúng plans trong thư mục này.

## 2. Bắt buộc tuân thủ
- Chỉ build đúng MVP đã mô tả
- Không thêm backend
- Không thêm auth
- Không thêm database
- Không thêm share link
- Không thêm lịch sử nhiều board
- Không tự ý mở rộng split mode ngoài equal split
- Không dùng UI quá phức tạp hoặc animation nặng

## 3. Ưu tiên kỹ thuật
- code clean
- component nhỏ, dễ đọc
- tách domain logic khỏi UI
- tên biến rõ nghĩa
- hạn chế duplicated logic
- validate input đầy đủ
- xử lý empty state, error state, loading state

## 4. Ưu tiên UI
- dễ nhìn
- màu nhẹ, hiện đại
- thao tác nhập nhanh
- summary nổi bật
- export/copy dễ thấy

## 5. Definition of done
Chỉ coi task hoàn tất khi:
1. app chạy được
2. logic tính đúng
3. CRUD member/expense chạy đúng
4. persist localStorage hoạt động
5. copy/export hoạt động
6. code structure sạch
7. không còn TODO lớn trong các tính năng MVP

## 6. Deliverables mong muốn
- source code hoàn chỉnh
- README ngắn để chạy project
- không cần test automation nếu thời gian ngắn, nhưng code phải dễ thêm test sau
- comment chỉ đặt ở chỗ logic thực sự cần giải thích

## 7. Build order đề nghị
1. types + store
2. members CRUD
3. expenses CRUD
4. calculation logic
5. summary UI
6. persistence
7. copy/export
8. polish UI

## 8. Prompt gợi ý để đưa cho AI builder
```txt
Read all markdown files inside /plans first.
Then build the MVP exactly as specified.
Do not add backend, auth, database, share links, or history.
Use Next.js App Router, TypeScript, Tailwind CSS, and Lucide React.
Keep the UI simple, clean, and highly usable.
Persist only the current board in localStorage.
Support equal split only.
Implement member CRUD, expense CRUD, summary, settlements, copy result, export PNG, export PDF, and clear all.
Separate business logic from UI components.
```
