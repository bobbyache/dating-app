import { CanActivateFn } from '@angular/router';
import { AccountsService } from '../_services/accounts.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountsService: AccountsService = inject(AccountsService);
  const toastr = inject(ToastrService)

  return accountsService.currentUser$.pipe(
    map(user => {
      if (!user) return false;
      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      } else {
        toastr.error('You cannot enter this area');
        return false;
      }
    })
  )
};
