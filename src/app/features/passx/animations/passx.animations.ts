import { animate, style, transition, trigger } from '@angular/animations';

export const passxFadeUp = trigger('passxFadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(16px)' }),
    animate('420ms cubic-bezier(.16,1,.3,1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const passxScale = trigger('passxScale', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px) scale(.96)' }),
    animate('260ms cubic-bezier(.16,1,.3,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
  ]),
  transition(':leave', [
    animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(-12px) scale(.97)' }))
  ])
]);
