import { toPng } from "html-to-image";

export async function exportElementAsPng(
  element: HTMLElement,
  filename: string,
): Promise<boolean> {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  } catch {
    return false;
  }
}
