import {
  ChangeDetectionStrategy, Component, computed, inject, signal
} from '@angular/core';
import { LanguageService } from '@core/services/language.service';

/**
 * Full-screen language-switch transition overlay.
 * Pure CSS animation — no third-party animation libraries.
 *
 * Technique: a skewed div sweeps top-left → bottom-right in 1 second.
 * Call `triggerFor(callback)` to start the animation, execute the callback
 * at the midpoint, then fade out.
 */
@Component({
  selector: 'app-language-transition',
  standalone: true,
  styles: [`
    :host { pointer-events: none; }

    .lt-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      overflow: hidden;
    }

    /* The diagonal sweep panel */
    .lt-panel {
      position: absolute;
      top: -20%;
      left: -60%;
      width: 80%;
      height: 140%;
      background: var(--bs-primary, #0d6efd);
      transform: skewX(-12deg) translateX(-100%);
      transition: transform 0s;
      will-change: transform;
      opacity: 0.95;
    }

    /* Sweep IN: panel slides from left to right */
    .lt-overlay.enter .lt-panel {
      animation: lt-sweep-in 0.5s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    /* Sweep OUT: panel continues past right edge */
    .lt-overlay.exit .lt-panel {
      animation: lt-sweep-out 0.5s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    @keyframes lt-sweep-in {
      from { transform: skewX(-12deg) translateX(-100%); }
      to   { transform: skewX(-12deg) translateX(225%); }
    }

    @keyframes lt-sweep-out {
      from { transform: skewX(-12deg) translateX(225%); }
      to   { transform: skewX(-12deg) translateX(600%); }
    }

    /* Flag label in center during transition */
    .lt-label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      opacity: 0;
      transition: opacity 0.15s ease;
      pointer-events: none;
    }

    .lt-overlay.enter .lt-label {
      animation: lt-label-show 0.5s ease forwards;
    }

    @keyframes lt-label-show {
      0%   { opacity: 0; }
      40%  { opacity: 1; }
      100% { opacity: 1; }
    }
  `],
  template: `
    @if (visible()) {
      <div class="lt-overlay" [class.enter]="phase() === 'enter'" [class.exit]="phase() === 'exit'" aria-hidden="true" role="presentation">
        <div class="lt-panel"></div>
        <span class="lt-label">{{ langSvc.currentLanguage().flag }}</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageTransitionComponent {
  readonly langSvc = inject(LanguageService);

  readonly visible = signal(false);
  readonly phase   = signal<'enter' | 'exit'>('enter');

  /**
   * Run the full 1-second diagonal sweep, calling `callback` at the midpoint
   * (when the screen is fully covered) so the language changes invisibly.
   */
  trigger(callback: () => void): void {
    this.visible.set(true);
    this.phase.set('enter');

    // Mid-point: screen fully covered — safe to swap language
    setTimeout(() => {
      callback();
      this.phase.set('exit');
    }, 500);

    // End: hide overlay after full animation completes
    setTimeout(() => {
      this.visible.set(false);
    }, 1000);
  }
}
