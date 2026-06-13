"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { formatCurrencyVnd } from "@/lib/format/currency";
import { getMemberColorById } from "@/lib/format/member-colors";
import { useBoardStore } from "@/store/board-store";
import { cn } from "@/lib/utils/cn";
import type { MemberSummary } from "@/types/board";

type SummaryPanelProps = {
  summaries: MemberSummary[];
};

export function SummaryPanel({ summaries }: SummaryPanelProps) {
  const members = useBoardStore((state) => state.board.members);

  if (summaries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/80 p-4 text-sm leading-6 text-slate-500">
        Thêm thành viên và khoản chi để xem tổng kết.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {summaries.map((s) => {
        const isPositive = s.balance > 1;
        const isNegative = s.balance < -1;
        const isZero = !isPositive && !isNegative;
        const color = getMemberColorById(members, s.memberId);

        return (
          <div
            className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm"
            key={s.memberId}
          >
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color.dot}`}>
              {s.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Chi: <strong className="text-slate-700">{formatCurrencyVnd(s.paid)}</strong>
              </p>
            </div>
            <div
              className={cn(
                "shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold",
                isPositive && "bg-emerald-50 text-emerald-700",
                isNegative && "bg-red-50 text-red-700",
                isZero && "bg-slate-50 text-slate-500",
              )}
            >
              {isPositive && <ArrowUp className="mr-1 inline size-3.5" />}
              {isNegative && <ArrowDown className="mr-1 inline size-3.5" />}
              {isZero && <Minus className="mr-1 inline size-3.5" />}
              {formatCurrencyVnd(s.balance)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
