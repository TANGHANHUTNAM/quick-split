import { formatCurrencyVnd } from "@/lib/format/currency";
import type { MemberSummary, Settlement } from "@/types/board";

type CopyResultInput = {
  boardTitle: string;
  summaries: MemberSummary[];
  settlements: Settlement[];
};

export function formatResultText({ boardTitle, summaries, settlements }: CopyResultInput): string {
  const lines: string[] = [];

  lines.push(`Quick Split — ${boardTitle}`);
  lines.push("");

  lines.push("Tổng kết từng thành viên:");
  for (const s of summaries) {
    const balance = s.balance;
    const sign = balance > 0 ? "+" : "";
    lines.push(`• ${s.name}: đã trả ${formatCurrencyVnd(s.paid)}, cần trả ${formatCurrencyVnd(s.owes)}, số dư ${sign}${formatCurrencyVnd(Math.abs(balance))}`);
  }

  lines.push("");
  lines.push("Số tiền thanh toán:");
  if (settlements.length === 0) {
    lines.push("Không cần chuyển khoản — tất cả đã cân bằng.");
  } else {
    const nameById = new Map(summaries.map((s) => [s.memberId, s.name]));
    for (const st of settlements) {
      const fromName = nameById.get(st.fromMemberId) ?? st.fromMemberId;
      const toName = nameById.get(st.toMemberId) ?? st.toMemberId;
      lines.push(`• ${fromName} → ${toName}: ${formatCurrencyVnd(st.amount)}`);
    }
  }

  return lines.join("\n");
}

export async function copyResultToClipboard(input: CopyResultInput): Promise<boolean> {
  const text = formatResultText(input);

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
