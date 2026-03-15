import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);

    const token = storageService.getToken();

    if (token) {
        return true;
    }

    // Redirect to sign-in page
    router.navigate(['/sign-in']);
    return false;
};
