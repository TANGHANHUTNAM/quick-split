import type { Expense, Member, MemberSummary, Settlement } from "@/types/board";

export function calculateMemberSummaries(members: Member[], expenses: Expense[]): MemberSummary[] {
  const summaries: MemberSummary[] = members.map((member) => ({
    memberId: member.id,
    name: member.name,
    paid: 0,
    owes: 0,
    balance: 0,
  }));

  const summaryMap = new Map(summaries.map((s) => [s.memberId, s]));

  for (const expense of expenses) {
    const payer = summaryMap.get(expense.paidByMemberId);
    if (payer) {
      payer.paid += expense.amount;
    }

    const sharePerPerson = expense.amount / expense.participantMemberIds.length;
    for (const participantId of expense.participantMemberIds) {
      const participant = summaryMap.get(participantId);
      if (participant) {
        participant.owes += sharePerPerson;
      }
    }
  }

  for (const summary of summaries) {
    summary.balance = summary.paid - summary.owes;
  }

  return summaries;
}

/**
 * Tối thiểu hóa số giao dịch bằng cách gom các debtor/creditor
 * có số dư gần bằng nhau, giảm số lần chuyển tiền.
 *
 * Thuật toán:
 * 1. Tách debtor (balance < 0) và creditor (balance > 0)
 * 2. Sắp xếp debtor tăng dần, creditor giảm dần
 * 3. Ghép cặp debtor lớn nhất với creditor lớn nhất
 * 4. Số tiền chuyển = min(|debtor|, creditor)
 * 5. Cập nhật số dư, bỏ người đã hết, tiếp tục
 * → Kết quả luôn <= n-1 giao dịch (tối thiểu lý thuyết)
 */
export function calculateSettlements(summaries: MemberSummary[]): Settlement[] {
  const settlements: Settlement[] = [];

  const debtors: { memberId: string; balance: number }[] = [];
  const creditors: { memberId: string; balance: number }[] = [];

  for (const s of summaries) {
    if (s.balance < -1) {
      debtors.push({ memberId: s.memberId, balance: s.balance });
    } else if (s.balance > 1) {
      creditors.push({ memberId: s.memberId, balance: s.balance });
    }
  }

  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]!;
    const creditor = creditors[j]!;

    const debtorOwes = Math.abs(debtor.balance);
    const creditorOwed = creditor.balance;
    const transferAmount = Math.min(debtorOwes, creditorOwed);

    if (transferAmount > 1) {
      settlements.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount: Math.round(transferAmount),
      });
    }

    debtor.balance += transferAmount;
    creditor.balance -= transferAmount;

    if (Math.abs(debtor.balance) < 1) i++;
    if (Math.abs(creditor.balance) < 1) j++;
  }

  return settlements;
}
