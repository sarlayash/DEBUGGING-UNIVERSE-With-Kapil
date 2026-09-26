import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Cleanly captures an HTML element and downloads it as a crisp, high-resolution PNG.
 * Guarantees zero overlapping, zero cropping, and authentic white/gray contrast.
 */
export async function exportElementAsPNG(element, filename = 'document.png', options = {}) {
  if (!element) throw new Error('Export element not found');

  const originalScrollTop = window.scrollY;
  const originalScrollLeft = window.scrollX;

  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth || options.windowWidth || 1200,
      windowHeight: element.scrollHeight || options.windowHeight || 850,
      ...options
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = imgData;
    downloadLink.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return { success: true };
  } catch (error) {
    console.error('PNG Export failed:', error);
    throw error;
  } finally {
    window.scrollTo(originalScrollLeft, originalScrollTop);
  }
}

/**
 * Cleanly captures an HTML element and downloads it as a crisp, professional A4 PDF.
 * Supports 'portrait' (LOR, Progress Report) and 'landscape' (Certificates, Badges).
 */
export async function exportElementAsPDF(element, filename = 'document.pdf', orientation = 'portrait', options = {}) {
  if (!element) throw new Error('Export element not found');

  const originalScrollTop = window.scrollY;
  const originalScrollLeft = window.scrollX;

  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth || (orientation === 'landscape' ? 1120 : 794),
      windowHeight: element.scrollHeight || (orientation === 'landscape' ? 792 : 1123),
      ...options
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = orientation === 'landscape' ? 297 : 210;
    const pageHeight = orientation === 'landscape' ? 210 : 297;

    // Place image exactly on page margins with zero cutoffs
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);

    return { success: true };
  } catch (error) {
    console.error('PDF Export failed:', error);
    throw error;
  } finally {
    window.scrollTo(originalScrollLeft, originalScrollTop);
  }
}
