# SplitMate Plans Index

Bộ tài liệu này được viết theo vai trò **PM/Product Owner** để AI hoặc developer có thể build app mà không cần hỏi lại nhiều.

## Mục tiêu sản phẩm
Xây dựng một mini app chia tiền nhóm bằng **Next.js + Tailwind CSS** với trải nghiệm đơn giản, dễ dùng, không cần đăng nhập, không cần database, chỉ lưu **1 board hiện tại** trên local storage và hỗ trợ **export ảnh / PDF**.

## Cách dùng bộ plans
Đọc theo thứ tự:

1. `01-PRODUCT-OVERVIEW.md`
2. `02-MVP-SCOPE.md`
3. `03-USER-STORIES-AND-FLOWS.md`
4. `04-DATA-MODEL-AND-BUSINESS-RULES.md`
5. `05-UI-UX-GUIDELINES.md`
6. `06-TECH-ARCHITECTURE.md`
7. `07-FEATURE-SPECS.md`
8. `08-PERSISTENCE-AND-EXPORT.md`
9. `09-IMPLEMENTATION-PHASES.md`
10. `10-ACCEPTANCE-CRITERIA.md`
11. `11-AI-BUILD-INSTRUCTIONS.md`

## Outcome mong muốn
Sau khi build xong, app phải cho phép:
- nhập danh sách thành viên
- thêm / sửa / xóa khoản chi
- tính toán ai trả ai
- copy kết quả
- export PNG
- export PDF
- lưu đúng 1 board hiện tại bằng localStorage
- clear all để tạo board mới

## Các nguyên tắc bắt buộc
- Không dùng database
- Không cần auth/login
- Không cần share link
- Không cần lưu lịch sử nhiều board
- Không over-engineer
- Ưu tiên UI rõ ràng, thao tác ít click, mobile-first nhưng desktop cũng đẹp

## Naming
Tên app mặc định trong bộ plan này là **SplitMate**.
Có thể đổi thành `ChiaTien` nếu muốn bản Việt hóa hoàn toàn.
