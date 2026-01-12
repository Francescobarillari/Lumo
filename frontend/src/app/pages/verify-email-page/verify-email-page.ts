import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'VerifyEmailPage',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verify-email-page.html',
  styleUrls: ['./verify-email-page.css']
})
export class VerifyEmailPage implements OnInit {

  token: string = '';
  verified: boolean = false;
  message: string = 'Click the button to verify your email.';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  verifyEmail() {
    if (!this.token) return;

    this.authService.verifyEmail(this.token).subscribe({
      next: (res) => {
        this.verified = true;
        this.message = 'You have been successfully registered! Signing you in...';

        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      },
      error: (err) => {
        this.verified = false;
        this.message = err.error?.error || 'Token is invalid or expired.';
      }
    });
  }
}
