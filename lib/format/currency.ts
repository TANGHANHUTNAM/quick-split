const vndFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

export function formatCurrencyVnd(amount: number) {
  if (!Number.isFinite(amount)) {
    return `${vndFormatter.format(0)} VNĐ`;
  }

  return `${vndFormatter.format(amount)} VNĐ`;
}
