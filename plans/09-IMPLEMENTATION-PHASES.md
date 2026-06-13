# Implementation Phases

## Phase 1: Foundation
### Mục tiêu
Khởi tạo project sạch và design system cơ bản.

### Tasks
- setup Next.js + TypeScript + Tailwind
- setup icon library
- setup UI primitives
- setup store
- setup type definitions
- setup utils format currency, ids, cn

### Output
- app chạy được với layout khung
- có shell UI cơ bản

---

## Phase 2: Member management
### Tasks
- create member form
- create member list
- implement add/edit/delete member
- implement validations
- implement toast

### Output
- member CRUD hoạt động ổn

---

## Phase 3: Expense management
### Tasks
- create expense form
- create participant selector
- create expense list
- implement add/edit/delete expense
- validate input

### Output
- expense CRUD hoạt động ổn

---

## Phase 4: Calculation engine
### Tasks
- summarize paid / owes / balance
- implement settlement algorithm
- build summary panel
- build settlement list

### Output
- app tính đúng cho equal split

---

## Phase 5: Persistence
### Tasks
- persist state to localStorage
- hydrate on load
- clear all reset

### Output
- reload không mất dữ liệu hiện tại

---

## Phase 6: Export and polish
### Tasks
- copy result
- export PNG
- export PDF
- empty states
- loading states
- responsive polish
- accessibility pass cơ bản

### Output
- app sẵn sàng demo / portfolio

---

## Phase 7: QA
### Tasks
- test happy path
- test edge cases
- test with 2, 3, 5, 10 members
- test no expense / no member states
- test rounding
- test mobile layout

### Output
- bản build ổn định cho MVP
