import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
    messages?: Message[];
    pagination?: Pagination;
    container = 'Unread';
    pageNumber = 1;
    pageSize = 5;
    
    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
            next: response => {
                this.messages = response.result;
                this.pagination = response.pagination;
            }
        });
    }

    pageChanged(event: any) {
        // guard clause as this component has caused problems before...
        // making multiple requests as the page number has not been updating for some reason. 
        if (this.pageNumber !== event.page) {
            this.pageNumber = event.page;
            this.loadMessages();
        }
    }
}
