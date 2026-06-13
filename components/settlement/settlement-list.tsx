"use client";

import { ArrowRight } from "lucide-react";

import { formatCurrencyVnd } from "@/lib/format/currency";
import { getMemberColorById } from "@/lib/format/member-colors";
import { useBoardStore } from "@/store/board-store";
import type { Settlement } from "@/types/board";

type SettlementListProps = {
  settlements: Settlement[];
};

export function SettlementList({ settlements }: SettlementListProps) {
  const members = useBoardStore((state) => state.board.members);

  function findMemberName(memberId: string) {
    return members.find((m) => m.id === memberId)?.name ?? "—";
  }

  if (settlements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/80 p-3 text-xs leading-5 text-slate-500 sm:p-4 sm:text-sm sm:leading-6">
        Không có chuyển khoản nào cần thực hiện. Tất cả đã cân bằng!
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {settlements.map((s, index) => {
        const fromColor = getMemberColorById(members, s.fromMemberId);
        const toColor = getMemberColorById(members, s.toMemberId);
        return (
          <div
            className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3"
            key={`${s.fromMemberId}-${s.toMemberId}-${index}`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 sm:size-8 sm:text-xs">
                {index + 1}
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:gap-2 sm:text-sm">
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium sm:gap-1.5 sm:px-2.5 sm:py-1 ${fromColor.bg} ${fromColor.text}`}>
                  <span className={`size-1 rounded-full sm:size-1.5 ${fromColor.dot}`} />
                  {findMemberName(s.fromMemberId)}
                </span>
                <ArrowRight className="size-3 text-slate-400 sm:size-4" />
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium sm:gap-1.5 sm:px-2.5 sm:py-1 ${toColor.bg} ${toColor.text}`}>
                  <span className={`size-1 rounded-full sm:size-1.5 ${toColor.dot}`} />
                  {findMemberName(s.toMemberId)}
                </span>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-primary sm:text-sm">{formatCurrencyVnd(s.amount)}</span>
          </div>
        );
      })}
    </div>
  );
}
