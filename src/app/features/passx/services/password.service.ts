import { Injectable } from '@angular/core';
import { PASSX_WORDS, PASSWORD_SETS } from '../constants/passx.constants';
import { PassOptions } from '../models/passx.models';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  buildPool(options: PassOptions): string {
    let pool = '';
    if (options.uppercase) pool += PASSWORD_SETS.uppercase;
    if (options.lowercase) pool += PASSWORD_SETS.lowercase;
    if (options.numbers) pool += PASSWORD_SETS.numbers;
    if (options.symbols) pool += PASSWORD_SETS.symbols;
    if (options.extendedSymbols) pool += PASSWORD_SETS.extendedSymbols;
    if (options.spaces) pool += PASSWORD_SETS.spaces;
    if (options.excludeAmbiguous) pool = [...pool].filter((char) => !PASSWORD_SETS.ambiguous.includes(char)).join('');
    if (options.excludeSimilar) pool = [...pool].filter((char) => !PASSWORD_SETS.similar.includes(char)).join('');
    return Array.from(new Set(pool.split(''))).join('');
  }

  generatePassword(options: PassOptions): string {
    if (options.mode === 'pin') {
      let value = '';
      for (let index = 0; index < options.length; index += 1) value += PASSWORD_SETS.numbers[this.rand(10)];
      return value;
    }

    if (options.mode === 'passphrase') {
      const count = Math.max(3, Math.min(12, Math.round(options.length / 6)));
      const words = Array.from({ length: count }, () => {
        const word = PASSX_WORDS[this.rand(PASSX_WORDS.length)];
        return options.uppercase ? this.capitalize(word) : word;
      });
      return words.join('-') + (options.numbers ? '-' + this.rand(99) : '');
    }

    if (options.mode === 'pronounceable') {
      const consonants = 'bcdfghjklmnpqrstvwxz';
      const vowels = 'aeiouy';
      let value = '';
      for (let index = 0; index < options.length; index += 1) {
        const set = index % 2 === 0 ? consonants : vowels;
        value += set[this.rand(20)] ?? consonants[0];
      }
      if (options.uppercase) value = this.capitalize(value);
      if (options.numbers) value += this.rand(99);
      return value.slice(0, options.length);
    }

    if (options.mode === 'memorable') {
      const wordOne = PASSX_WORDS[this.rand(PASSX_WORDS.length)];
      const wordTwo = PASSX_WORDS[this.rand(PASSX_WORDS.length)];
      return `${this.capitalize(wordOne)}${this.rand(99)}${this.capitalize(wordTwo)}!`.slice(0, Math.max(options.length, 10));
    }

    const pool = this.buildPool(options);
    if (!pool) {
      return '';
    }

    const requiredSets = this.requiredSets(options);
    const chars: string[] = [];

    for (let index = 0; index < options.length; index += 1) {
      let tries = 0;
      while (tries < 50) {
        tries += 1;
        const char = pool[this.rand(pool.length)];
        const previous = chars[chars.length - 1];
        if (options.avoidRepeated && previous === char) continue;
        if (options.avoidSequential && previous && this.isSequential(previous, char)) continue;
        if (options.excludeDuplicates && chars.includes(char)) continue;
        chars.push(char);
        break;
      }
      if (chars.length <= index) chars.push(pool[this.rand(pool.length)]);
    }

    for (const set of requiredSets) {
      if (!chars.some((char) => set.includes(char))) {
        chars[this.rand(chars.length)] = set[this.rand(set.length)];
      }
    }

    return chars.join('');
  }

  private requiredSets(options: PassOptions): string[] {
    if (!options.enforceEach) {
      return [];
    }

    const sets: string[] = [];
    if (options.uppercase) sets.push(PASSWORD_SETS.uppercase);
    if (options.lowercase) sets.push(PASSWORD_SETS.lowercase);
    if (options.numbers) sets.push(PASSWORD_SETS.numbers);
    if (options.symbols) sets.push(PASSWORD_SETS.symbols);
    return sets;
  }

  private rand(size: number): number {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % size;
  }

  private isSequential(a: string, b: string): boolean {
    return Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 1;
  }

  private capitalize(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
  }
}
