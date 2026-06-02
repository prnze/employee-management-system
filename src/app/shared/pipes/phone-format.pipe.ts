import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: true })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    const digits = (value ?? '').replace(/\D/g, '');
    return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : value ?? '';
  }
}
