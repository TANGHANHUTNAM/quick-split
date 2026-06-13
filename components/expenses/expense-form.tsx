"use client";

import { useState, type FormEvent } from "react";
import { Check, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { formatAmountInput, parseFormattedAmount } from "@/lib/format/amount-input";
import { getMemberColor } from "@/lib/format/member-colors";
import { useBoardStore } from "@/store/board-store";
import type { Expense } from "@/types/board";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ExpenseFormProps = {
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
};

export function ExpenseForm({ editingExpense = null, onCancelEdit }: ExpenseFormProps) {
  const members = useBoardStore((state) => state.board.members);
  const addExpense = useBoardStore((state) => state.addExpense);
  const updateExpense = useBoardStore((state) => state.updateExpense);

  const [title, setTitle] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [paidByMemberId, setPaidByMemberId] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const isEditing = editingExpense !== null;
  const disabled = members.length === 0;

  function toggleParticipant(memberId: string) {
    setParticipantIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
  }

  function toggleAllParticipants() {
    if (participantIds.length === members.length) {
      setParticipantIds([]);
    } else {
      setParticipantIds(members.map((m) => m.id));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountNumber = parseFormattedAmount(amountDisplay);

    if (isEditing) {
      const result = updateExpense(editingExpense.id, title, amountNumber, paidByMemberId, participantIds);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Đã cập nhật khoản chi "${result.expense.title}".`);
      onCancelEdit?.();
    } else {
      const result = addExpense(title, amountNumber, paidByMemberId, participantIds);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Đã thêm khoản chi "${result.expense.title}".`);
    }

    setTitle("");
    setAmountDisplay("");
    setPaidByMemberId("");
    setParticipantIds([]);
  }

  function handleCancel() {
    setTitle("");
    setAmountDisplay("");
    setPaidByMemberId("");
    setParticipantIds([]);
    onCancelEdit?.();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700" htmlFor="expense-title">
          Tên khoản chi
        </label>
        <Input
          disabled={disabled}
          id="expense-title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ví dụ: Ăn trưa, Taxi, Hotel"
          value={title}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700" htmlFor="expense-amount">
          Số tiền (VNĐ)
        </label>
        <Input
          disabled={disabled}
          id="expense-amount"
          inputMode="decimal"
          onChange={(event) => setAmountDisplay(formatAmountInput(event.target.value))}
          placeholder="0"
          value={amountDisplay}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700" htmlFor="expense-paid-by">
          Người chi
        </label>
        <select
          className="flex h-10 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          id="expense-paid-by"
          onChange={(event) => setPaidByMemberId(event.target.value)}
          value={paidByMemberId}
        >
          <option value="">— Chọn người chi —</option>
          {members.map((member, index) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Người tham gia ({participantIds.length}/{members.length})
          </label>
          {members.length > 1 && (
            <button
              className="text-xs font-medium text-primary hover:underline"
              onClick={toggleAllParticipants}
              type="button"
            >
              {participantIds.length === members.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          )}
        </div>
        {disabled ? (
          <p className="text-sm text-slate-400">Thêm ít nhất 1 thành viên để chọn người tham gia.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {members.map((member, index) => {
              const checked = participantIds.includes(member.id);
              const color = getMemberColor(index);
              return (
                <button
                  className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
                    checked
                      ? `${color.border} ${color.bg} ${color.text}`
                      : "border-border bg-white text-slate-600 hover:border-primary/40"
                  }`}
                  key={member.id}
                  onClick={() => toggleParticipant(member.id)}
                  type="button"
                >
                  {member.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button disabled={disabled} className="sm:flex-1" type="submit">
          {isEditing ? (
            <>
              <Check className="mr-2 size-4" /> Cập nhật
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" /> Thêm khoản chi
            </>
          )}
        </Button>
        {isEditing && (
          <Button className="sm:flex-1" onClick={handleCancel} type="button" variant="outline">
            <RotateCcw className="mr-2 size-4" /> Hủy
          </Button>
        )}
      </div>

      {disabled && (
        <p className="text-sm text-slate-400">
          Hãy thêm ít nhất 1 thành viên để bắt đầu nhập khoản chi.
        </p>
      )}
    </form>
  );
}
