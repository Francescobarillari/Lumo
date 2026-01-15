import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VerifyEmailPage } from './pages/verify-email-page/verify-email-page';
import { ResetPasswordPage } from './pages/reset-password-page/reset-password-page';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'verify-email', component: VerifyEmailPage },
  { path: 'reset-password', component: ResetPasswordPage }
];
