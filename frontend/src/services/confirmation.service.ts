import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ConfirmTone = 'accent' | 'danger';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

export interface ConfirmDialogState {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  tone: ConfirmTone;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private readonly stateSubject = new BehaviorSubject<ConfirmDialogState | null>(null);
  readonly state$ = this.stateSubject.asObservable();
  private pendingResolve: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    if (!options.message) {
      return Promise.resolve(false);
    }

    if (this.pendingResolve) {
      this.pendingResolve(false);
    }

    return new Promise(resolve => {
      this.pendingResolve = resolve;
      this.stateSubject.next({
        title: options.title ?? 'Confirm action',
        message: options.message,
        confirmText: options.confirmText ?? 'Confirm',
        cancelText: options.cancelText ?? 'Cancel',
        tone: options.tone ?? 'accent'
      });
    });
  }

  resolve(result: boolean) {
    if (this.pendingResolve) {
      this.pendingResolve(result);
      this.pendingResolve = null;
    }
    this.stateSubject.next(null);
  }
}
