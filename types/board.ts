export type Member = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidByMemberId: string;
  participantMemberIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Board = {
  id: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
};

export type MemberSummary = {
  memberId: string;
  name: string;
  paid: number;
  owes: number;
  balance: number;
};

export type Settlement = {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
};
