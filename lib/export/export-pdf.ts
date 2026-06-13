import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export async function exportElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<boolean> {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const img = new Image();
    img.alt = "Quick Split export";
    img.src = dataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const pxW = img.width;
    const pxH = img.height;

    const pdf = new jsPDF({
      orientation: pxW > pxH ? "landscape" : "portrait",
      unit: "px",
      format: [pxW, pxH],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, pxW, pxH);
    pdf.save(filename);
    return true;
  } catch {
    return false;
  }
}
