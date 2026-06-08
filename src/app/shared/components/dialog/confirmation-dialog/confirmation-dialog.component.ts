import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  input,
  output
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ConfirmationDialogData } from '../dialog.models';
import { DEFAULT_DIALOG_ICONS, DEFAULT_DIALOG_LABELS } from '../dialog.constants';

@Component({
  selector: 'app-confirmation-dialog-root',
  standalone: true,
  imports: [TranslatePipe, IconComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
  readonly data = input.required<ConfirmationDialogData>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  @ViewChild('confirmBtn') private confirmBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('dialogContainer') private dialogContainer!: ElementRef<HTMLElement>;

  iconName = '';
  confirmLabel = '';
  cancelLabel = '';
  hasCancel = true;

  ngOnInit(): void {
    const d = this.data();
    const variant = d.variant ?? 'info';
    this.iconName = d.icon ?? DEFAULT_DIALOG_ICONS[variant];
    this.confirmLabel = d.confirmText ?? DEFAULT_DIALOG_LABELS.confirmText;
    
    // If cancelText is explicitly set to empty string, disable the cancel button
    if (d.cancelText === '') {
      this.hasCancel = false;
      this.cancelLabel = '';
    } else {
      this.hasCancel = true;
      this.cancelLabel = d.cancelText ?? DEFAULT_DIALOG_LABELS.cancelText;
    }
  }

  ngAfterViewInit(): void {
    // Focus the confirm button by default for keyboard accessibility
    setTimeout(() => {
      this.confirmBtn.nativeElement?.focus();
    }, 50);
  }

  @HostListener('keydown.escape', ['$event'])
  onEscape(event: Event): void {
    event.preventDefault();
    if (this.hasCancel) {
      this.onCancel();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event): void {
    // Prevent double submission if focus is already on button
    if (document.activeElement === this.confirmBtn.nativeElement) {
      return;
    }
    event.preventDefault();
    this.onConfirm();
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event): void {
    if (!this.dialogContainer) return;
    const keyEvent = event as KeyboardEvent;
    const focusableElements = this.dialogContainer.nativeElement.querySelectorAll<HTMLElement>(
      'button, [tabindex="0"]'
    );
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (keyEvent.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        keyEvent.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        keyEvent.preventDefault();
      }
    }
  }

  onBackdropClick(): void {
    if (!this.data().disableBackdropClick) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
