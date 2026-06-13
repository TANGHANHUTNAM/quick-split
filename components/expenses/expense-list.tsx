"use client";

import { useState } from "react";

import { LayoutGrid, PencilLine, Rows3, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatCurrencyVnd } from "@/lib/format/currency";
import { getMemberColorById } from "@/lib/format/member-colors";
import { useBoardStore } from "@/store/board-store";
import { cn } from "@/lib/utils/cn";
import type { Expense } from "@/types/board";

import { Button } from "../ui/button";

type ViewMode = "table" | "card";

type ExpenseListProps = {
  onEditExpense: (expense: Expense) => void;
};

export function ExpenseList({ onEditExpense }: ExpenseListProps) {
  const members = useBoardStore((state) => state.board.members);
  const expenses = useBoardStore((state) => state.board.expenses);
  const removeExpense = useBoardStore((state) => state.removeExpense);
  const [view, setView] = useState<ViewMode>("table");

  function findMemberName(memberId: string) {
    return members.find((m) => m.id === memberId)?.name ?? "—";
  }

  function handleDelete(expense: Expense) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa khoản chi "${expense.title}"?`);
    if (!confirmed) return;

    const result = removeExpense(expense.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Đã xóa khoản chi "${expense.title}".`);
  }

  function renderPayer(memberId: string) {
    const c = getMemberColorById(members, memberId);
    return (
      <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:gap-1 sm:px-2 sm:text-xs ${c.bg} ${c.text}`}>
        <span className={`size-1 rounded-full sm:size-1.5 ${c.dot}`} />
        {findMemberName(memberId)}
      </span>
    );
  }

  function renderParticipants(ids: string[]) {
    return (
      <div className="flex flex-wrap gap-0.5 sm:gap-1">
        {ids.map((id) => {
          const c = getMemberColorById(members, id);
          return (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:gap-1 sm:px-2 sm:text-xs ${c.bg} ${c.text}`} key={id}>
              <span className={`size-1 rounded-full sm:size-1.5 ${c.dot}`} />
              {findMemberName(id)}
            </span>
          );
        })}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/80 p-3 text-xs leading-5 text-slate-500 sm:p-4 sm:text-sm sm:leading-6">
        Chưa có khoản chi nào. Nhập thông tin ở form bên trên để thêm khoản chi đầu tiên.
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* View toggle */}
      <div className="flex justify-end">
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs",
              view === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => setView("table")}
          >
            <Rows3 className="size-3 sm:size-3.5" /> Bảng
          </button>
          <button
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs",
              view === "card" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => setView("card")}
          >
            <LayoutGrid className="size-3 sm:size-3.5" /> Thẻ
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-[10px] sm:text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-slate-500">
                <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-2">#</th>
                <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-2">Danh mục</th>
                <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-2">Người chi</th>
                <th className="whitespace-nowrap px-2 py-1 text-right font-medium sm:px-3 sm:py-2">Chi phí</th>
                <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-2">Người tham gia</th>
                <th className="px-2 py-1 text-right font-medium sm:px-3 sm:py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr className="border-b border-border/50 last:border-0" key={expense.id}>
                  <td className="whitespace-nowrap px-2 py-1 text-slate-400 sm:px-3 sm:py-2">{index + 1}</td>
                  <td className="whitespace-nowrap px-2 py-1 font-medium text-slate-800 sm:px-3 sm:py-2">{expense.title}</td>
                  <td className="whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2">{renderPayer(expense.paidByMemberId)}</td>
                  <td className="whitespace-nowrap px-2 py-1 text-right font-bold text-primary sm:px-3 sm:py-2">{formatCurrencyVnd(expense.amount)}</td>
                  <td className="px-2 py-1 sm:px-3 sm:py-2">{renderParticipants(expense.participantMemberIds)}</td>
                  <td className="whitespace-nowrap px-2 py-1 text-right sm:px-3 sm:py-2">
                    <div className="flex justify-end gap-0.5">
                      <Button onClick={() => onEditExpense(expense)} size="sm" variant="ghost">
                        <PencilLine className="size-3.5" />
                      </Button>
                      <Button
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(expense)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <div className="space-y-2 sm:space-y-3">
          {expenses.map((expense, index) => (
              <div
                className="rounded-2xl border border-border bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3"
                key={expense.id}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <p className="min-w-0 flex-1 text-xs text-slate-500 sm:text-sm">
                    <span className="mr-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 sm:size-5 sm:text-xs">
                      {index + 1}
                    </span>
                    Danh mục chi: <span className="font-semibold text-slate-800">{expense.title}</span>
                  </p>
                  <span className="shrink-0 text-xs font-bold text-primary sm:text-sm">
                    {formatCurrencyVnd(expense.amount)}
                  </span>
                </div>

                <div className="mt-1.5 space-y-1 text-[10px] text-slate-600 sm:mt-2 sm:text-xs">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="shrink-0 text-slate-400">Người chi:</span>
                    {renderPayer(expense.paidByMemberId)}
                  </div>
                  <div className="flex items-start gap-1 sm:gap-1.5">
                    <span className="shrink-0 pt-0.5 text-slate-400">Người tham gia:</span>
                    {renderParticipants(expense.participantMemberIds)}
                  </div>
                </div>

                <div className="mt-2 flex justify-end gap-1 border-t border-border/60 pt-2 sm:mt-3">
                  <Button onClick={() => onEditExpense(expense)} size="sm" variant="ghost">
                    <PencilLine className="mr-1 size-3.5" /> Sửa
                  </Button>
                  <Button
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(expense)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="mr-1 size-3.5" /> Xóa
                  </Button>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
