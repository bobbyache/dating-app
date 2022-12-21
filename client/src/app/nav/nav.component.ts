import { Component, OnInit } from '@angular/core';
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

    constructor(public accountService: AccountsService) {}

    ngOnInit(): void {}

    login() {
        this.accountService.login(this.model).subscribe({
            next: response => {
                console.log(response);
            },
            error: error => console.log(error)
        });
    }

    logout() {
        this.accountService.logout();
    }
}
