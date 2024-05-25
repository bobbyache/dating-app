import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
    standalone: true,
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
    imports: [CommonModule, FormsModule, TimeagoModule]
})
export class MemberMessagesComponent implements OnInit {
    @Input() username?: string;
    @Input() messages: Message[] = [];
    
    constructor() {}

    ngOnInit(): void {
    }
}
