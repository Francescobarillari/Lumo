import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userStr = localStorage.getItem('user');

    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.isAdmin === 'true' || user.isAdmin === true) {
            return true;
        }
    }

    router.navigate(['/']);
    return false;
};
