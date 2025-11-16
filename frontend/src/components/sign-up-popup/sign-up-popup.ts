import { Component, EventEmitter, Output } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { FormField } from '../../components/form-field/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'SignUpPopup',
  standalone: true,
  imports: [CircleIcon, FormField, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './sign-up-popup.html',
  styleUrls: ['./sign-up-popup.css'],  
})
export class SignUpPopup {
  @Output() close = new EventEmitter<void>();

  constructor(public responsive: ResponsiveService) {}

  closePopup() {
    this.close.emit();
  }
}
