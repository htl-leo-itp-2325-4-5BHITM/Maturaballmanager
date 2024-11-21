import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isValid = await authService.validateToken();

    if (!isValid) {
        const refreshedToken = await authService.refreshToken();
        if (!refreshedToken) {
            await authService.logout();
            await router.navigate(['/login']);
            return false;
        }
    }

    return true;
};