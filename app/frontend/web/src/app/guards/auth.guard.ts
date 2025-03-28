import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {PromService} from "../services/prom.service";


export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const promService = inject(PromService);

    const isValid = await authService.validateToken();

    if (!isValid) {
        const refreshedToken = await authService.refreshToken();
        if (!refreshedToken) {
            await authService.logout();
            await router.navigate(['/login']);
            return false;
        }
    }

    const hasActiveProm = await promService.getActiveProm();
    if (!hasActiveProm && state.url !== '/settings/appointment') {
        await router.navigate(['/settings/appointment']);
        return false;
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;

    if (requiredRoles && requiredRoles.length > 0 && !await authService.hasRoles(requiredRoles)) {
        await router.navigate(['/dashboard']);
        return false;
    }

    return true;
};