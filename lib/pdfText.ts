// Pulls the text out of a PDF in the browser with pdf.js, so learners can
// read their own Amharic books. The PDF never leaves the device. pdf.js runs
// its worker from public/pdf.worker.min.mjs (copied from pdfjs-dist; update
// both together).
//
// Only PDFs whose text is real Unicode Amharic work. Scans, and PDFs typed
// with older Ethiopian fonts (Power Geez, Visual Geez) that store Latin
// letters drawn as ፊደል, come out empty or as gibberish; the caller checks
// with amharicShare (lib/myBooks.ts).

const MAX_PAGES = 400;

export async function pdfText(file: File, onProgress?: (done: number, total: number) => void): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const total = Math.min(doc.numPages, MAX_PAGES);
  const pages: string[] = [];
  for (let n = 1; n <= total; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    let text = '';
    let lastY: number | null = null;
    for (const item of content.items) {
      if (!('str' in item)) continue;
      const y = item.transform[5];
      // a new line in the PDF: a space, or a paragraph break when there's a gap
      if (lastY !== null && Math.abs(y - lastY) > 1) text += Math.abs(y - lastY) > item.height * 1.8 ? '\n\n' : ' ';
      text += item.str;
      if (item.hasEOL) text += ' ';
      lastY = y;
    }
    pages.push(text.trim());
    onProgress?.(n, total);
  }
  await task.destroy();
  return pages.filter(Boolean).join('\n\n');
}
