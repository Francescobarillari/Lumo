import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ConfirmationService, ConfirmDialogState } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog implements OnDestroy {
  state$: Observable<ConfirmDialogState | null>;
  private isOpen = false;
  private readonly subscription: Subscription;

  constructor(private confirmation: ConfirmationService) {
    this.state$ = this.confirmation.state$;
    this.subscription = this.confirmation.state$.subscribe(state => {
      this.isOpen = !!state;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onConfirm() {
    this.confirmation.resolve(true);
  }

  onCancel() {
    this.confirmation.resolve(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.onCancel();
    }
  }
}
