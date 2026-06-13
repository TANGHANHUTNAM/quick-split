import Link from "next/link";
import { ArrowRight, Coins, ReceiptText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
      <div className="mx-auto max-w-xl text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Quick Split
          </h1>
          <p className="text-lg text-slate-600">
            Chia tiền nhóm gọn nhẹ cho bạn bè, du lịch và ăn uống. Đơn vị VNĐ, giao diện tiếng Việt.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-left sm:flex-row sm:gap-6">
          <Feature
            icon={<Users className="size-5 text-primary" />}
            text="Thêm thành viên nhóm"
          />
          <Feature
            icon={<ReceiptText className="size-5 text-primary" />}
            text="Ghi nhận khoản chi"
          />
          <Feature
            icon={<Coins className="size-5 text-primary" />}
            text="Tự động gợi ý chuyển khoản"
          />
        </div>

        <Link
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
          href="/split"
        >
          Chia tiền
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-white px-4 py-3 text-sm text-slate-700">
      {icon}
      {text}
    </div>
  );
}
