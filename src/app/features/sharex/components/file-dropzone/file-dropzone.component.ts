import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { formatFileSize, getFileIcon } from '../../models/share.model';

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

  removeFile(index: number): void {
    const updated = this.files().filter((_, i) => i !== index);
    this.filesChange.emit(updated);
  }

  private addFiles(newFiles: File[]): void {
    this.filesChange.emit([...this.files(), ...newFiles]);
  }
}
