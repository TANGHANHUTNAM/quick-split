"use client";

import { useState, type FormEvent } from "react";
import { Check, PencilLine, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { getMemberColor } from "@/lib/format/member-colors";
import { useBoardStore } from "@/store/board-store";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function MemberList() {
  const members = useBoardStore((state) => state.board.members);
  const updateMember = useBoardStore((state) => state.updateMember);
  const removeMember = useBoardStore((state) => state.removeMember);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function startEditing(memberId: string, memberName: string) {
    setEditingId(memberId);
    setDraftName(memberName);
  }

  function stopEditing() {
    setEditingId(null);
    setDraftName("");
  }

  function handleSave(memberId: string) {
    const result = updateMember(memberId, draftName);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`Đã cập nhật thành viên thành ${result.member.name}.`);
    stopEditing();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, memberId: string) {
    event.preventDefault();
    handleSave(memberId);
  }

  function handleDelete(memberId: string, memberName: string) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa ${memberName} khỏi board hiện tại?`);

    if (!confirmed) {
      return;
    }

    const result = removeMember(memberId);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`Đã xóa ${memberName} khỏi danh sách.`);
    if (editingId === memberId) {
      stopEditing();
    }
  }

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/80 p-3 text-xs leading-5 text-slate-500 sm:p-4 sm:text-sm sm:leading-6">
        Chưa có thành viên nào. Hãy thêm ít nhất 2 người để chuẩn bị cho bước nhập khoản chi.
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {members.map((member, index) => {
        const isEditing = editingId === member.id;
        const color = getMemberColor(index);

        return (
          <div
            className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4"
            key={member.id}
          >
            {isEditing ? (
              <form className="space-y-2 sm:space-y-3" onSubmit={(event) => handleSubmit(event, member.id)}>
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="info">Đang sửa</Badge>
                  <span className="text-[10px] text-slate-400 sm:text-xs">Thành viên #{index + 1}</span>
                </div>
                <Input
                  aria-label={`Sửa tên thành viên ${member.name}`}
                  onChange={(event) => setDraftName(event.target.value)}
                  value={draftName}
                />
                <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
                  <Button className="sm:flex-1" type="submit">
                    <Check className="mr-2 size-4" /> Lưu
                  </Button>
                  <Button className="sm:flex-1" onClick={stopEditing} type="button" variant="outline">
                    <X className="mr-2 size-4" /> Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white sm:size-8 sm:text-xs ${color.dot}`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 sm:text-sm">{member.name}</p>
                    <span className="text-[10px] text-slate-400 sm:text-xs">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <Button onClick={() => startEditing(member.id, member.name)} size="sm" variant="ghost">
                    <PencilLine className="size-3.5 sm:size-4" />
                  </Button>
                  <Button
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(member.id, member.name)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="size-3.5 sm:size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
