import type { Member } from "@/types/board";

export const MEMBER_NAME_REQUIRED_ERROR = "Tên thành viên không được để trống.";
export const MEMBER_NAME_DUPLICATE_ERROR = "Tên thành viên đã tồn tại.";
export const MEMBER_IN_USE_ERROR = "Không thể xóa thành viên đang được dùng trong khoản chi.";
export const MEMBER_NOT_FOUND_ERROR = "Không tìm thấy thành viên cần thao tác.";

export function normalizeMemberName(name: string) {
  return name.trim();
}

export function normalizeMemberKey(name: string) {
  return normalizeMemberName(name).toLocaleLowerCase("vi-VN");
}

export function validateMemberName(name: string) {
  const normalized = normalizeMemberName(name);

  if (!normalized) {
    return {
      ok: false as const,
      error: MEMBER_NAME_REQUIRED_ERROR,
    };
  }

  return {
    ok: true as const,
    normalizedName: normalized,
  };
}

export function hasDuplicateMemberName(members: Member[], name: string, exceptId?: string) {
  const normalizedName = normalizeMemberKey(name);

  return members.some((member) => {
    if (member.id === exceptId) {
      return false;
    }

    return normalizeMemberKey(member.name) === normalizedName;
  });
}
