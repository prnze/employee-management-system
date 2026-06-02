import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appDate', standalone: true })
export class AppDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('en-IN');

  transform(value: string | Date | null | undefined, format = 'mediumDate'): string {
    return this.datePipe.transform(value, format) ?? '';
  }
}
