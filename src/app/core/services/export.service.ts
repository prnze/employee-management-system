import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportService {
  downloadCsv<T extends object>(rows: T[], filename: string): void {
    const headers = Object.keys(rows[0] ?? {});
    const body = rows.map((row) => {
      const record = row as Record<string, unknown>;
      return headers.map((header) => this.csvCell(record[header])).join(',');
    });
    this.download([headers.join(','), ...body].join('\n'), `${filename}.csv`, 'text/csv');
  }

  downloadExcel<T extends object>(rows: T[], filename: string): void {
    const html = `<table>${rows
      .map((row) => `<tr>${Object.values(row).map((value) => `<td>${this.escapeHtml(this.safeSpreadsheetValue(value))}</td>`).join('')}</tr>`)
      .join('')}</table>`;
    this.download(html, `${filename}.xls`, 'application/vnd.ms-excel');
  }

  private csvCell(value: unknown): string {
    return JSON.stringify(this.safeSpreadsheetValue(value));
  }

  private safeSpreadsheetValue(value: unknown): string {
    const text = String(value ?? '');
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }

  private escapeHtml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  private download(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
