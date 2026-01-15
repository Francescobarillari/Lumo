import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormField } from '../../../components/form-field/form-field';
import { strongPasswordValidator } from '../../../validators/validators';

@Component({
  selector: 'ResetPasswordPage',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormField],
  templateUrl: './reset-password-page.html',
  styleUrls: ['./reset-password-page.css']
})
export class ResetPasswordPage implements OnInit {
  token = '';
  message = '';
  isError = false;
  completed = false;
  canSubmit = true;
  errors: { [key: string]: string } = {};

  form: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.nonNullable.group({
      newPassword: ['', [strongPasswordValidator]],
      confirmPassword: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.canSubmit = false;
        this.isError = true;
        this.message = 'Reset link is missing or invalid.';
      }
    });
  }

  onSubmit() {
    this.errors = {};
    this.message = '';
    this.isError = false;

    if (!this.token) {
      this.isError = true;
      this.message = 'Reset link is missing or invalid.';
      return;
    }

    const controls = this.form.controls;
    const passwordErr = strongPasswordValidator(controls['newPassword']);
    if (passwordErr) {
      this.errors['newPassword'] = 'Password must be at least 8 characters, with a capital letter, number, and symbol.';
    }

    const newPassword = this.form.value.newPassword || '';
    const confirmPassword = this.form.value.confirmPassword || '';
    if (newPassword !== confirmPassword) {
      this.errors['confirmPassword'] = 'Passwords do not match.';
    }

    if (Object.keys(this.errors).length > 0) {
      this.isError = true;
      this.message = Object.values(this.errors)[0] || 'Fix the errors above.';
      return;
    }

    this.authService.confirmPasswordReset({ token: this.token, newPassword }).subscribe({
      next: () => {
        this.completed = true;
        this.isError = false;
        this.message = 'Password updated. You can sign in now.';
      },
      error: (err) => {
        const body = err?.error;
        if (body?.data && typeof body.data === 'object') {
          this.errors = body.data;
          this.isError = true;
          this.message = Object.values(this.errors)[0] || 'Unable to reset password.';
          return;
        }
        if (typeof body?.error === 'string') {
          this.isError = true;
          this.message = body.error;
          return;
        }
        if (typeof err?.error === 'string') {
          this.isError = true;
          this.message = err.error;
          return;
        }
        if (typeof err === 'string') {
          this.isError = true;
          this.message = err;
          return;
        }
        this.isError = true;
        this.message = 'Reset link is invalid or expired.';
      }
    });
  }
}
