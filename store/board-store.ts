"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createId } from "@/lib/utils/ids";
import {
  hasDuplicateMemberName,
  MEMBER_IN_USE_ERROR,
  MEMBER_NAME_DUPLICATE_ERROR,
  MEMBER_NOT_FOUND_ERROR,
  validateMemberName,
} from "@/lib/validation/member";
import {
  EXPENSE_AMOUNT_INVALID_ERROR,
  EXPENSE_NOT_FOUND_ERROR,
  EXPENSE_PARTICIPANT_NOT_FOUND_ERROR,
  EXPENSE_PARTICIPANTS_REQUIRED_ERROR,
  EXPENSE_PAID_BY_REQUIRED_ERROR,
  EXPENSE_TITLE_REQUIRED_ERROR,
} from "@/lib/validation/expense";
import { type Board, type Expense, type Member } from "@/types/board";

type MemberActionResult =
  | { ok: true; member: Member }
  | { ok: false; error: string };

type RemoveMemberResult =
  | { ok: true }
  | { ok: false; error: string };

type ExpenseActionResult =
  | { ok: true; expense: Expense }
  | { ok: false; error: string };

type RemoveExpenseResult =
  | { ok: true }
  | { ok: false; error: string };

type BoardStore = {
  board: Board;
  addMember: (name: string) => MemberActionResult;
  addMembers: (names: string[]) => MemberActionResult[];
  updateMember: (memberId: string, name: string) => MemberActionResult;
  removeMember: (memberId: string) => RemoveMemberResult;
  addExpense: (
    title: string,
    amount: number,
    paidByMemberId: string,
    participantMemberIds: string[],
  ) => ExpenseActionResult;
  updateExpense: (
    expenseId: string,
    title: string,
    amount: number,
    paidByMemberId: string,
    participantMemberIds: string[],
  ) => ExpenseActionResult;
  removeExpense: (expenseId: string) => RemoveExpenseResult;
  removeAllMembers: () => void;
  clearExpenses: () => void;
  resetBoard: () => void;
};

function createEmptyBoard(): Board {
  const timestamp = new Date().toISOString();

  return {
    id: createId("board"),
    members: [],
    expenses: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function validateExpenseFields(
  title: string,
  amount: number,
  paidByMemberId: string,
  participantMemberIds: string[],
  members: Member[],
): { ok: false; error: string } | { ok: true; normalTitle: string; roundedAmount: number } {
  const trimmed = title.trim();
  if (!trimmed) return { ok: false, error: EXPENSE_TITLE_REQUIRED_ERROR };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: EXPENSE_AMOUNT_INVALID_ERROR };
  if (!paidByMemberId || !members.some((m) => m.id === paidByMemberId)) {
    return { ok: false, error: EXPENSE_PAID_BY_REQUIRED_ERROR };
  }
  if (participantMemberIds.length === 0) {
    return { ok: false, error: EXPENSE_PARTICIPANTS_REQUIRED_ERROR };
  }
  const memberIds = new Set(members.map((m) => m.id));
  const allValid = participantMemberIds.every((id) => memberIds.has(id));
  if (!allValid) return { ok: false, error: EXPENSE_PARTICIPANT_NOT_FOUND_ERROR };

  return { ok: true, normalTitle: trimmed, roundedAmount: Math.round(amount) };
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      board: createEmptyBoard(),
      addMembers: (names) => {
        const results: MemberActionResult[] = [];
        for (const name of names) {
          const result = useBoardStore.getState().addMember(name);
          results.push(result);
        }
        return results;
      },
      addMember: (name) => {
        const validation = validateMemberName(name);

        if (!validation.ok) {
          return validation;
        }

        const snapshot = useBoardStore.getState().board;

        if (hasDuplicateMemberName(snapshot.members, validation.normalizedName)) {
          return { ok: false, error: MEMBER_NAME_DUPLICATE_ERROR };
        }

        const member: Member = {
          id: createId("member"),
          name: validation.normalizedName,
        };

        set((state) => ({
          board: {
            ...state.board,
            members: [...state.board.members, member],
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true, member };
      },
      updateMember: (memberId, name) => {
        const validation = validateMemberName(name);

        if (!validation.ok) {
          return validation;
        }

        const snapshot = useBoardStore.getState().board;
        const member = snapshot.members.find((item) => item.id === memberId);

        if (!member) {
          return { ok: false, error: MEMBER_NOT_FOUND_ERROR };
        }

        if (hasDuplicateMemberName(snapshot.members, validation.normalizedName, memberId)) {
          return { ok: false, error: MEMBER_NAME_DUPLICATE_ERROR };
        }

        const updatedMember: Member = {
          ...member,
          name: validation.normalizedName,
        };

        set((state) => ({
          board: {
            ...state.board,
            members: state.board.members.map((item) =>
              item.id === memberId ? updatedMember : item,
            ),
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true, member: updatedMember };
      },
      removeMember: (memberId) => {
        const snapshot = useBoardStore.getState().board;
        const memberExists = snapshot.members.some((item) => item.id === memberId);

        if (!memberExists) {
          return { ok: false, error: MEMBER_NOT_FOUND_ERROR };
        }

        const isInUse = snapshot.expenses.some(
          (expense) =>
            expense.paidByMemberId === memberId || expense.participantMemberIds.includes(memberId),
        );

        if (isInUse) {
          return { ok: false, error: MEMBER_IN_USE_ERROR };
        }

        set((state) => ({
          board: {
            ...state.board,
            members: state.board.members.filter((item) => item.id !== memberId),
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true };
      },
      addExpense: (title, amount, paidByMemberId, participantMemberIds) => {
        const snapshot = useBoardStore.getState().board;
        const fieldCheck = validateExpenseFields(title, amount, paidByMemberId, participantMemberIds, snapshot.members);
        if (!fieldCheck.ok) return fieldCheck;

        const expense: Expense = {
          id: createId("expense"),
          title: fieldCheck.normalTitle,
          amount: fieldCheck.roundedAmount,
          paidByMemberId,
          participantMemberIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          board: {
            ...state.board,
            expenses: [...state.board.expenses, expense],
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true, expense };
      },
      updateExpense: (expenseId, title, amount, paidByMemberId, participantMemberIds) => {
        const snapshot = useBoardStore.getState().board;
        const existing = snapshot.expenses.find((e) => e.id === expenseId);
        if (!existing) return { ok: false, error: EXPENSE_NOT_FOUND_ERROR };

        const fieldCheck = validateExpenseFields(title, amount, paidByMemberId, participantMemberIds, snapshot.members);
        if (!fieldCheck.ok) return fieldCheck;

        const updated: Expense = {
          ...existing,
          title: fieldCheck.normalTitle,
          amount: fieldCheck.roundedAmount,
          paidByMemberId,
          participantMemberIds,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          board: {
            ...state.board,
            expenses: state.board.expenses.map((e) => (e.id === expenseId ? updated : e)),
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true, expense: updated };
      },
      removeExpense: (expenseId) => {
        const snapshot = useBoardStore.getState().board;
        const exists = snapshot.expenses.some((e) => e.id === expenseId);
        if (!exists) return { ok: false, error: EXPENSE_NOT_FOUND_ERROR };

        set((state) => ({
          board: {
            ...state.board,
            expenses: state.board.expenses.filter((e) => e.id !== expenseId),
            updatedAt: new Date().toISOString(),
          },
        }));

        return { ok: true };
      },
      removeAllMembers: () =>
        set((state) => ({
          board: {
            ...state.board,
            members: [],
            expenses: [],
            updatedAt: new Date().toISOString(),
          },
        })),
      clearExpenses: () =>
        set((state) => ({
          board: {
            ...state.board,
            expenses: [],
            updatedAt: new Date().toISOString(),
          },
        })),
      resetBoard: () => set({ board: createEmptyBoard() }),
    }),
    {
      name: "splitmate-board",
      partialize: (state) => ({ board: state.board }),
    },
  ),
);
