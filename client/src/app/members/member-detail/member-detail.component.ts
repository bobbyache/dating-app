import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

@Component({
    standalone: true,
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
    imports: [GalleryModule, TabsModule, CommonModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
    @ViewChild('memberTabs') memberTabs?: TabsetComponent;
    member: Member | undefined;
    images: GalleryItem[] = [];
    activeTab?: TabDirective
    messages: Message[] = [];

    constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService) {}

    ngOnInit(): void {
        this.loadMember();
    }

    onTabActivated(data: TabDirective) {
        this.activeTab = data;
        if (this.activeTab.heading === 'Messages') {
            this.loadMessages();
        }
    }

    loadMessages() {
        if (this.member) {
            this.messageService.getMessageThread(this.member.username).subscribe({
                next: messages => this.messages = messages
            });
        }
    }

    getImages() {
        if (!this.member) return;

        for (const photo of this.member.photos) {
            this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
        }
    }

    loadMember() {
        var username = this.route.snapshot.paramMap.get('username');
        if (!username) return;
        this.memberService.getMember(username).subscribe({
            next: member => {
                this.member = member;
                this.getImages();
            }
        });
    }
}
