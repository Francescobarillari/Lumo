import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'VerifyEmailPopup',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './verify-email-popup.html',
  styleUrls: ['./verify-email-popup.css']
})
export class VerifyEmailPopup {
  @Input() email!: string;
  @Input() token!: string;
  @Input() verified: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() resendVerification = new EventEmitter<void>();

  constructor(public responsive: ResponsiveService) {}

  onClose() {
    this.close.emit();
  }

  resend() {
    this.resendVerification.emit();
  }
  closePopup() {
    this.close.emit();
  }
}
