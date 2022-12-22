import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountsService } from '../_services/accounts.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountsService, private toastr: ToastrService) {}
    canActivate(): Observable<boolean> {
        return this.accountService.currentUser$.pipe(map(user => {
            if (user) return true;
            this.toastr.error('You shall not pass');
            return false;
        }))
    }
}
