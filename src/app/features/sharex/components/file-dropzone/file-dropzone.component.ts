import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { formatFileSize, getFileIcon } from '../../models/share.model';

interface FileEntry {
  file: File;
  relativePath: string;
}

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  templateUrl: './file-dropzone.component.html',
  styleUrl: './file-dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropzoneComponent {
  readonly files = input<File[]>([]);
  readonly filesChange = output<File[]>();
  readonly isDragOver = signal(false);

  readonly formatFileSize = formatFileSize;
  readonly getFileIcon = getFileIcon;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const dropped = Array.from(event.dataTransfer?.files || []);
    this.addFiles(dropped);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = Array.from(input.files || []);
    this.addFiles(selected);
    input.value = '';
  }

  onFolderSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = Array.from(input.files || []);
    // Files from webkitdirectory have webkitRelativePath set automatically
    this.addFiles(selected);
    input.value = '';
  }

  removeFile(index: number): void {
    const updated = this.files().filter((_, i) => i !== index);
    this.filesChange.emit(updated);
  }

  /**
   * Get the display path for a file.
   * Uses webkitRelativePath for folder-uploaded files, falls back to file name.
   */
  getDisplayPath(file: File): string {
    // webkitRelativePath is set for files from folder selection
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
    if (relativePath) return relativePath;
    return file.name;
  }

  /**
   * Check if a file has a folder path (was uploaded via folder selection).
   */
  hasFolder(file: File): boolean {
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
    return !!relativePath && relativePath.includes('/');
  }

  /**
   * Get the folder portion of a file's path.
   */
  getFolderPath(file: File): string {
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
    if (!relativePath) return '';
    const parts = relativePath.split('/');
    return parts.slice(0, -1).join('/');
  }

  private addFiles(newFiles: File[]): void {
    this.filesChange.emit([...this.files(), ...newFiles]);
  }
}
