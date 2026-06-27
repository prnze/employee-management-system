import { inject, Injectable } from '@angular/core';
import { SharexStorageService } from './sharex-storage.service';
import { ShareFile } from '../models/share.model';

export interface UploadState {
  status: 'uploading' | 'success' | 'error';
  currentFileName: string;
  fileIndex: number;
  totalFiles: number;
  /** 0-100 overall progress across all files */
  percent: number;
  /** Simulated upload speed display */
  speed: string;
  /** Estimated time remaining */
  eta: string;
  errorMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadManagerService {
  private readonly storage = inject(SharexStorageService);

  /**
   * Upload files with simulated progress tracking.
   *
   * Uses the Supabase SDK for actual uploads while providing
   * perceived progress via simulation. Real XHR progress will be
   * added in v2 when moving to private/signed uploads.
   *
   * @param shareId  - The share to attach files to
   * @param files    - Array of files to upload
   * @param onProgress - Callback invoked with progress state updates
   * @returns The uploaded ShareFile records
   */
  async uploadFiles(
    shareId: string,
    files: File[],
    onProgress: (state: UploadState) => void
  ): Promise<ShareFile[]> {
    const results: ShareFile[] = [];
    const totalFiles = files.length;
    const startTime = Date.now();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileStartTime = Date.now();

      // Start simulated progress for this file
      const basePercent = (i / totalFiles) * 100;
      const fileWeight = 100 / totalFiles;

      // Phase 1: Simulate progress to ~85% over estimated time
      const estimatedMs = this.estimateUploadTime(file.size);
      const progressInterval = this.simulateProgress(
        basePercent,
        fileWeight,
        estimatedMs,
        file.name,
        i,
        totalFiles,
        startTime,
        files,
        onProgress
      );

      try {
        // Actual upload via Supabase SDK
        const uploadedFiles = await this.storage.uploadFiles(shareId, [file]);
        results.push(...uploadedFiles);

        // Cancel simulation, jump to file complete
        clearInterval(progressInterval);

        const completedPercent = ((i + 1) / totalFiles) * 100;
        const elapsed = Date.now() - startTime;

        onProgress({
          status: i === files.length - 1 ? 'success' : 'uploading',
          currentFileName: file.name,
          fileIndex: i,
          totalFiles,
          percent: Math.round(completedPercent),
          speed: this.formatSpeed(file.size, Date.now() - fileStartTime),
          eta: this.formatEta(elapsed, i + 1, totalFiles)
        });
      } catch (err) {
        clearInterval(progressInterval);
        onProgress({
          status: 'error',
          currentFileName: file.name,
          fileIndex: i,
          totalFiles,
          percent: Math.round(basePercent),
          speed: '—',
          eta: '—',
          errorMessage: err instanceof Error ? err.message : 'Upload failed'
        });
        throw err;
      }
    }

    return results;
  }

  /**
   * Simulate progress from 0% to ~85% of the file's weight
   * over an estimated duration. Returns the interval ID for cleanup.
   */
  private simulateProgress(
    basePercent: number,
    fileWeight: number,
    estimatedMs: number,
    fileName: string,
    fileIndex: number,
    totalFiles: number,
    globalStartTime: number,
    allFiles: File[],
    onProgress: (state: UploadState) => void
  ): ReturnType<typeof setInterval> {
    const maxSimulatedProgress = 0.85; // Don't go past 85% of file weight
    const intervalMs = 150;
    let elapsed = 0;

    return setInterval(() => {
      elapsed += intervalMs;
      // Ease-out curve: fast start, slows near 85%
      const rawProgress = Math.min(elapsed / estimatedMs, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3); // cubic ease-out
      const simulatedFilePercent = eased * maxSimulatedProgress;
      const currentPercent = basePercent + simulatedFilePercent * fileWeight;

      const totalElapsed = Date.now() - globalStartTime;
      const totalSize = allFiles.reduce((s, f) => s + f.size, 0);
      const estimatedSpeed = totalSize / Math.max(totalElapsed / 1000, 0.1);

      onProgress({
        status: 'uploading',
        currentFileName: fileName,
        fileIndex,
        totalFiles,
        percent: Math.min(Math.round(currentPercent), 99),
        speed: this.formatBytes(estimatedSpeed) + '/s',
        eta: this.formatEta(totalElapsed, fileIndex, totalFiles)
      });
    }, intervalMs);
  }

  /**
   * Estimate upload time based on file size.
   * Assumes ~2 MB/s upload speed for simulation pacing.
   */
  private estimateUploadTime(sizeBytes: number): number {
    const assumedBytesPerSecond = 2 * 1024 * 1024; // 2 MB/s
    const seconds = sizeBytes / assumedBytesPerSecond;
    // Minimum 800ms, maximum 30s simulation
    return Math.max(800, Math.min(seconds * 1000, 30_000));
  }

  private formatSpeed(bytes: number, ms: number): string {
    if (ms <= 0) return '—';
    const bytesPerSec = bytes / (ms / 1000);
    return this.formatBytes(bytesPerSec) + '/s';
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private formatEta(elapsedMs: number, completedFiles: number, totalFiles: number): string {
    if (completedFiles >= totalFiles) return '0s';
    if (completedFiles === 0) return '...';

    const avgMsPerFile = elapsedMs / completedFiles;
    const remainingFiles = totalFiles - completedFiles;
    const remainingMs = avgMsPerFile * remainingFiles;
    const remainingSec = Math.ceil(remainingMs / 1000);

    if (remainingSec < 60) return `${remainingSec}s`;
    const minutes = Math.floor(remainingSec / 60);
    const seconds = remainingSec % 60;
    return `${minutes}m ${seconds}s`;
  }
}
