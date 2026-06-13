const MEMBER_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500" },
  { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
  { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" },
];

export type MemberColor = (typeof MEMBER_COLORS)[number];

export function getMemberColor(index: number): MemberColor {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
}

export function getMemberColorById(members: { id: string }[], memberId: string): MemberColor {
  const index = members.findIndex((m) => m.id === memberId);
  return getMemberColor(index >= 0 ? index : 0);
}
