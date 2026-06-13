import type { Member } from "@/types/board";

export const EXPENSE_TITLE_REQUIRED_ERROR = "Tên khoản chi không được để trống.";
export const EXPENSE_AMOUNT_INVALID_ERROR = "Số tiền phải lớn hơn 0.";
export const EXPENSE_PAID_BY_REQUIRED_ERROR = "Phải chọn người trả.";
export const EXPENSE_PARTICIPANTS_REQUIRED_ERROR = "Phải chọn ít nhất 1 người tham gia.";
export const EXPENSE_PARTICIPANT_NOT_FOUND_ERROR = "Có thành viên không tồn tại trong danh sách.";
export const EXPENSE_NOT_FOUND_ERROR = "Không tìm thấy khoản chi cần thao tác.";

export function validateExpenseTitle(title: string) {
  const normalized = title.trim();
  if (!normalized) {
    return { ok: false as const, error: EXPENSE_TITLE_REQUIRED_ERROR };
  }
  return { ok: true as const, normalizedName: normalized };
}

export function validateExpenseAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false as const, error: EXPENSE_AMOUNT_INVALID_ERROR };
  }
  return { ok: true as const, amount };
}

export function validateExpensePaidBy(paidByMemberId: string, members: Member[]) {
  if (!paidByMemberId) {
    return { ok: false as const, error: EXPENSE_PAID_BY_REQUIRED_ERROR };
  }
  if (!members.some((m) => m.id === paidByMemberId)) {
    return { ok: false as const, error: EXPENSE_PAID_BY_REQUIRED_ERROR };
  }
  return { ok: true as const };
}

export function validateExpenseParticipants(participantMemberIds: string[], members: Member[]) {
  if (participantMemberIds.length === 0) {
    return { ok: false as const, error: EXPENSE_PARTICIPANTS_REQUIRED_ERROR };
  }
  const memberIds = new Set(members.map((m) => m.id));
  const allValid = participantMemberIds.every((id) => memberIds.has(id));
  if (!allValid) {
    return { ok: false as const, error: EXPENSE_PARTICIPANT_NOT_FOUND_ERROR };
  }
  return { ok: true as const };
}
