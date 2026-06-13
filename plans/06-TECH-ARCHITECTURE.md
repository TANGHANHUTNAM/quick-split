# Technical Architecture

## 1. Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide React
- State management nhẹ (khuyến nghị Zustand)
- Form library (khuyến nghị React Hook Form)
- Validation (khuyến nghị Zod)
- Export image (khuyến nghị html-to-image)
- Export PDF (khuyến nghị jsPDF)
- Toast (khuyến nghị Sonner)

## 2. Architecture goals
- đơn giản
- dễ maintain
- tách logic tính toán ra khỏi UI
- component rõ trách nhiệm
- không over-abstract

## 3. Suggested folder structure
```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css

  components/
    board/
      board-header.tsx
      board-actions.tsx
    members/
      member-form.tsx
      member-list.tsx
    expenses/
      expense-form.tsx
      expense-list.tsx
      expense-item.tsx
    summary/
      summary-panel.tsx
      settlement-list.tsx
    ui/
      button.tsx
      input.tsx
      card.tsx
      dialog.tsx
      badge.tsx

  lib/
    calculations/
      summarize-board.ts
      settle-balances.ts
    export/
      export-image.ts
      export-pdf.ts
    format/
      currency.ts
    utils/
      cn.ts
      ids.ts

  store/
    board-store.ts

  types/
    board.ts
```

## 4. State shape
Global state nên giữ:
- board title
- members
- expenses
- computed summary / settlement có thể derive runtime

Không cần lưu computed state cứng vào storage nếu có thể derive từ members + expenses.

## 5. State rules
- source of truth là board data
- summary và settlement được tính lại mỗi khi board đổi
- localStorage persist tự động
- clear all phải xóa persist key

## 6. Module boundaries
### UI layer
Chỉ render và nhận actions

### Store layer
Quản lý state, CRUD actions, persist

### Domain logic layer
Xử lý:
- summarize
- settlement
- validation helpers

### Export layer
- chụp block summary
- tải ảnh / PDF

## 7. Performance expectations
App nhỏ nên không cần tối ưu quá mức.
Tuy nhiên:
- dùng memo hợp lý cho computed data
- tránh re-render lớn không cần thiết
- list expense không cần virtualization cho MVP
