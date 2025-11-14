import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignUp } from './sign-up/sign-up';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'sign-up', component: SignUp },
];
