import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxUploadService {
  readFile(file: File): Promise<string> {
    return file.text();
  }
}
