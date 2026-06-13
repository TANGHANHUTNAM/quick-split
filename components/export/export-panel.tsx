"use client";

import { useState } from "react";

import {
  Download,
  FileText,
  Image,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { exportElementAsPng } from "@/lib/export/export-image";
import { exportElementAsPdf } from "@/lib/export/export-pdf";
import { Badge } from "../ui/badge";

type ExportPanelProps = {
  exportRef: React.RefObject<HTMLDivElement | null>;
};

type ExportAction = "png" | "pdf";

export function ExportPanel({
  exportRef,
}: ExportPanelProps) {
  const [loading, setLoading] = useState<ExportAction | null>(null);

  async function handleExportPng() {
    if (!exportRef.current) return;
    setLoading("png");
    const ok = await exportElementAsPng(exportRef.current, `quick-split-${Date.now()}.png`);
    setLoading(null);

    if (ok) {
      toast.success("Đã xuất ảnh PNG!");
    } else {
      toast.error("Không thể xuất ảnh. Vui lòng thử lại.");
    }
  }

  async function handleExportPdf() {
    if (!exportRef.current) return;
    setLoading("pdf");
    const ok = await exportElementAsPdf(exportRef.current, `quick-split-${Date.now()}.pdf`);
    setLoading(null);

    if (ok) {
      toast.success("Đã xuất PDF!");
    } else {
      toast.error("Không thể xuất PDF. Vui lòng thử lại.");
    }
  }

  const busy = loading !== null;

  return (
    <Card>
      <CardHeader>
        <SectionHeading
          action={<Badge variant="info">Xuất & chia sẻ</Badge>}
          description="Xuất ảnh hoặc PDF để gửi nhóm."
          icon={<Download className="size-4" />}
          title="Xuất kết quả"
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={busy}
            onClick={handleExportPng}
            variant="outline"
          >
            {loading === "png" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Image className="mr-2 size-4" role="img" aria-label="Ảnh" />
            )}
            Xuất PNG
          </Button>

          <Button
            disabled={busy}
            onClick={handleExportPdf}
            variant="outline"
          >
            {loading === "pdf" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <FileText className="mr-2 size-4" />
            )}
            Xuất PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
