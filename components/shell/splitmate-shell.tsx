"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowRight,
  ArrowUp,
  ReceiptText,
  RotateCcw,
  Users,
  Wallet,
} from "lucide-react";
import { Toaster, toast } from "sonner";

import { ExportPanel } from "@/components/export/export-panel";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import { MemberForm } from "@/components/members/member-form";
import { MemberList } from "@/components/members/member-list";
import { SettlementList } from "@/components/settlement/settlement-list";
import { useHydration } from "@/lib/hooks/use-hydration";
import { calculateMemberSummaries, calculateSettlements } from "@/lib/calc/settlement";
import { formatCurrencyVnd } from "@/lib/format/currency";
import { getMemberColorById } from "@/lib/format/member-colors";
import { cn } from "@/lib/utils/cn";
import { useBoardStore } from "@/store/board-store";
import type { Expense } from "@/types/board";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { SectionHeading } from "../ui/section-heading";

type Tab = "members" | "split";

const TABS: { key: Tab; label: string; hint: string; icon: React.ReactNode }[] = [
  {
    key: "members",
    label: "Bước 1: Thành viên",
    hint: "Thêm người tham gia",
    icon: <Users className="size-4" />,
  },
  {
    key: "split",
    label: "Bước 2: Chia tiền",
    hint: "Nhập khoản chi & chia đều",
    icon: <ReceiptText className="size-4" />,
  },
];

export function SplitShell() {
  const hydrated = useHydration();
  const board = useBoardStore((state) => state.board);
  const clearExpenses = useBoardStore((state) => state.clearExpenses);
  const removeAllMembers = useBoardStore((state) => state.removeAllMembers);

  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const summaries = useMemo(
    () => calculateMemberSummaries(board.members, board.expenses),
    [board.members, board.expenses],
  );

  const settlements = useMemo(() => calculateSettlements(summaries), [summaries]);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function findMemberName(memberId: string) {
    return board.members.find((m) => m.id === memberId)?.name ?? "—";
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  function handleRemoveAllMembers() {
    if (!window.confirm("Xoá tất cả thành viên và khoản chi?")) return;
    removeAllMembers();
    toast.success("Đã xoá tất cả thành viên và khoản chi.");
  }

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <p className="text-sm text-slate-400">Đang tải dữ liệu…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-background">
      <Toaster position="top-right" richColors />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
        {/* Tab bar */}
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all sm:gap-3 sm:px-4 sm:py-3",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9",
                    isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {tab.icon}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold sm:text-sm", isActive ? "text-primary" : "text-slate-700")}>
                    {tab.label}
                  </p>
                  <p className="text-[10px] text-slate-400 sm:text-xs">{tab.hint}</p>
                </div>
              </button>
            );
          })}
        </div>

        {activeTab === "members" && (
          <div className="flex flex-col gap-3 sm:gap-4">
            <MemberForm />
            <MemberList />
            {board.members.length > 0 && (
              <Button
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                onClick={handleRemoveAllMembers}
                variant="outline"
              >
                <RotateCcw className="mr-2 size-4" /> Xoá tất cả thành viên
              </Button>
            )}
          </div>
        )}

        {activeTab === "split" && (
          <div className="flex flex-col gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <SectionHeading
                  description="Nhập tiêu đề, số tiền VNĐ, chọn người chi và người tham gia."
                  icon={<ReceiptText className="size-4" />}
                  title="Khoản chi"
                />
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <ExpenseForm
                  editingExpense={editingExpense}
                  key={editingExpense?.id ?? "new"}
                  onCancelEdit={handleCancelEdit}
                />
                <ExpenseList onEditExpense={handleEditExpense} />
              </CardContent>
            </Card>

            {/* Visible summary — responsive for mobile */}
            <Card>
              <CardHeader>
                <SectionHeading
                  description={`Tóm tắt ${board.members.length} thành viên, ${board.expenses.length} khoản chi.`}
                  icon={<Wallet className="size-4" />}
                  title="Tóm tắt kết quả"
                />
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5">
                {/* Member pills */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                    Thành viên ({summaries.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {summaries.map((s) => {
                      const color = getMemberColorById(board.members, s.memberId);
                      return (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs ${color.bg} ${color.text}`} key={s.memberId}>
                          <span className={`size-1 rounded-full sm:size-1.5 ${color.dot}`} />
                          {s.name}
                          <span className="opacity-60">· {formatCurrencyVnd(s.paid)}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expense table */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                    Khoản chi ({board.expenses.length})
                  </p>
                  {board.expenses.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-[10px] sm:text-xs">
                        <thead>
                          <tr className="border-b border-border bg-slate-50 text-slate-500">
                            <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-1.5">#</th>
                            <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-1.5">Danh mục</th>
                            <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-1.5">Người chi</th>
                            <th className="whitespace-nowrap px-2 py-1 text-right font-medium sm:px-3 sm:py-1.5">Chi phí</th>
                            <th className="whitespace-nowrap px-2 py-1 font-medium sm:px-3 sm:py-1.5">Người tham gia</th>
                          </tr>
                        </thead>
                        <tbody>
                          {board.expenses.map((exp, i) => {
                            const payer = getMemberColorById(board.members, exp.paidByMemberId);
                            return (
                              <tr className="border-b border-border/50 last:border-0" key={exp.id}>
                                <td className="whitespace-nowrap px-2 py-1 text-slate-400 sm:px-3 sm:py-1.5">{i + 1}</td>
                                <td className="whitespace-nowrap px-2 py-1 font-medium text-slate-800 sm:px-3 sm:py-1.5">{exp.title}</td>
                                <td className="whitespace-nowrap px-2 py-1 sm:px-3 sm:py-1.5">
                                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium sm:gap-1 sm:px-2 ${payer.bg} ${payer.text}`}>
                                    {findMemberName(exp.paidByMemberId)}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-2 py-1 text-right font-bold text-primary sm:px-3 sm:py-1.5">{formatCurrencyVnd(exp.amount)}</td>
                                <td className="px-2 py-1 sm:px-3 sm:py-1.5">
                                  <div className="flex flex-wrap gap-0.5 sm:gap-1">
                                    {exp.participantMemberIds.map((id) => {
                                      const c = getMemberColorById(board.members, id);
                                      return (
                                        <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium sm:gap-1 sm:px-2 ${c.bg} ${c.text}`} key={id}>
                                          {findMemberName(id)}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 sm:text-xs">Chưa có khoản chi nào.</p>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                    Số tiền thanh toán
                  </p>
                  <SettlementList settlements={settlements} />
                </div>
              </CardContent>
            </Card>

            {/* Hidden export container — always rendered at desktop width */}
            <div
              className="pointer-events-none absolute left-[-9999px] top-0 z-[-1] overflow-hidden"
              aria-hidden="true"
            >
              <div ref={exportRef} className="w-[800px] bg-white p-6 font-sans">
                {/* Title */}
                <h1 className="mb-1 text-2xl font-bold text-slate-900">Quick Split</h1>
                <p className="mb-5 text-sm text-slate-500">
                  {board.members.length} thành viên · {board.expenses.length} khoản chi
                </p>

                {/* Member pills */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Thành viên ({summaries.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {summaries.map((s) => {
                      const color = getMemberColorById(board.members, s.memberId);
                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color.bg} ${color.text}`} key={s.memberId}>
                          <span className={`size-1.5 rounded-full ${color.dot}`} />
                          {s.name}
                          <span className="opacity-60">· {formatCurrencyVnd(s.paid)}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expense table */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Khoản chi ({board.expenses.length})
                  </p>
                  {board.expenses.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="whitespace-nowrap px-3 py-1.5 font-medium">#</th>
                          <th className="whitespace-nowrap px-3 py-1.5 font-medium">Danh mục</th>
                          <th className="whitespace-nowrap px-3 py-1.5 font-medium">Người chi</th>
                          <th className="whitespace-nowrap px-3 py-1.5 text-right font-medium">Chi phí</th>
                          <th className="whitespace-nowrap px-3 py-1.5 font-medium">Người tham gia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {board.expenses.map((exp, i) => {
                          const payer = getMemberColorById(board.members, exp.paidByMemberId);
                          return (
                            <tr className="border-b border-slate-100 last:border-0" key={exp.id}>
                              <td className="whitespace-nowrap px-3 py-1.5 text-slate-400">{i + 1}</td>
                              <td className="whitespace-nowrap px-3 py-1.5 font-medium text-slate-800">{exp.title}</td>
                              <td className="whitespace-nowrap px-3 py-1.5">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${payer.bg} ${payer.text}`}>
                                  {findMemberName(exp.paidByMemberId)}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-1.5 text-right font-bold text-primary">{formatCurrencyVnd(exp.amount)}</td>
                              <td className="px-3 py-1.5">
                                <div className="flex flex-wrap gap-1">
                                  {exp.participantMemberIds.map((id) => {
                                    const c = getMemberColorById(board.members, id);
                                    return (
                                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${c.bg} ${c.text}`} key={id}>
                                        {findMemberName(id)}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-xs text-slate-400">Chưa có khoản chi nào.</p>
                  )}
                </div>

                {/* Settlements */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Số tiền thanh toán
                  </p>
                  {settlements.length === 0 ? (
                    <p className="text-xs text-slate-500">Tất cả đã cân bằng!</p>
                  ) : (
                    <div className="space-y-2">
                      {settlements.map((s, index) => {
                        const fromColor = getMemberColorById(board.members, s.fromMemberId);
                        const toColor = getMemberColorById(board.members, s.toMemberId);
                        return (
                          <div
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                            key={`${s.fromMemberId}-${s.toMemberId}-${index}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${fromColor.bg} ${fromColor.text}`}>
                                  <span className={`size-1.5 rounded-full ${fromColor.dot}`} />
                                  {findMemberName(s.fromMemberId)}
                                </span>
                                <ArrowRight className="size-4 text-slate-400" />
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${toColor.bg} ${toColor.text}`}>
                                  <span className={`size-1.5 rounded-full ${toColor.dot}`} />
                                  {findMemberName(s.toMemberId)}
                                </span>
                              </div>
                            </div>
                            <span className="shrink-0 text-sm font-bold text-primary">{formatCurrencyVnd(s.amount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ExportPanel exportRef={exportRef} />

            <Button onClick={clearExpenses} variant="outline">
              <RotateCcw className="mr-2 size-4" /> Xoá tất cả khoản chi
            </Button>
          </div>
        )}
      </main>

      {/* Scroll to top */}
      <button
        className={cn(
          "fixed bottom-5 right-5 z-50 flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 sm:bottom-6 sm:right-6 sm:size-12",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp className="size-4 sm:size-5" />
      </button>
    </div>
  );
}
