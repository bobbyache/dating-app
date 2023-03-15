import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountsService } from '../_services/accounts.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(public accountService: AccountsService, private router: Router, private toastr: ToastrService) {}

    ngOnInit(): void {}

    login() {
        //
        // TODO: (Rob) If you log out as a female and come in as a male you'll see the 
        // the same male listing you saw before because we're remember the list.
        // To fix this must inject memberService and over here, reset the user params.
        // then you will get the right filter applied.
        this.accountService.login(this.model).subscribe({
            next: (_) => this.router.navigateByUrl('/members'),
        });
    }

    logout() {
        this.router.navigateByUrl('/');
        this.accountService.logout();
    }
}
