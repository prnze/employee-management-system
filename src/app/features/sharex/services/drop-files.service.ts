import { Injectable, signal } from '@angular/core';

/**
 * Bridge service to pass dropped files from the global drop zone (layout)
 * to the create page. Uses a signal so the create page can reactively
 * consume pending files on init.
 */
@Injectable({ providedIn: 'root' })
export class DropFilesService {
  readonly pendingFiles = signal<File[]>([]);

  /**
   * Set files from the global drop zone.
   */
  setPending(files: File[]): void {
    this.pendingFiles.set(files);
  }

  /**
   * Consume and clear pending files. Returns the files that were pending.
   */
  consume(): File[] {
    const files = this.pendingFiles();
    this.pendingFiles.set([]);
    return files;
  }

  /**
   * Check if there are pending files without consuming them.
   */
  hasPending(): boolean {
    return this.pendingFiles().length > 0;
  }
}
