import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VerifyEmailPage } from './pages/verify-email-page/verify-email-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'verify-email', component: VerifyEmailPage }
];
