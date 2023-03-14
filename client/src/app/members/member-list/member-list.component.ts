import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
    members: Member[] = [];
    pagination: Pagination | undefined;
    pageNumber = 1;
    pageSize = 5;
    
    constructor(private memberService: MembersService) {}

    ngOnInit(): void {
        // this.members$ = this.memberService.getMembers();
        this.loadMembers();
    }

    loadMembers() {
        this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
            next: response => {
                if (response.result && response.pagination) {
                    this.members = response.result;
                    this.pagination = response.pagination;
                }
            }
        });
    }

    pageChanged(event: any) {
        // guard clause as this component has caused problems before...
        // making multiple requests as the page number has not been updating for some reason. 
        if (this.pageNumber !== event.page) {
            this.pageNumber = event.page;
            this.loadMembers();
        }
    }
}
