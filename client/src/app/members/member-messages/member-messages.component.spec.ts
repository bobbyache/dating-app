import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DebugElement, importProvidersFrom } from "@angular/core";
import { Message } from "../../_models/message";
import { MemberMessagesComponent } from "./member-messages.component";
import { MessageService } from "src/app/_services/message.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TimeagoClock, TimeagoFormatter, TimeagoModule } from "ngx-timeago";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

xdescribe('MemberMessagesComponent', () => {
    let component: MemberMessagesComponent;
    let fixture: ComponentFixture<MemberMessagesComponent>;
    let el: DebugElement;
    let messageServiceStub: Partial<MessageService>;

    const messagesStub: Message[] = [{
            id: 1,
            senderId: 1,
            senderPhotoUrl: 'bob.jpg',
            senderUsername: 'Bob',
            recipientUsername: 'Jen',
            recipientPhotoUrl: 'jen.jpg',
            messageSent: new Date('2022-03-25'),
            dateRead:  new Date('2022-03-25'),
            content: 'hello jen'
    },
    {
        id: 2,
        senderId: 1,
        senderPhotoUrl: 'bob.jpg',
        senderUsername: 'Bob',
        recipientUsername: 'Jen',
        recipientPhotoUrl: 'jen.jpg',
        messageSent: new Date('2022-03-26'),
        dateRead:  new Date('2022-03-26'),
        content: 'you there?'
    },
    {
        id: 3,
        senderId: 1,
        senderPhotoUrl: 'bob.jpg',
        senderUsername: 'Bob',
        recipientUsername: 'Jen',
        recipientPhotoUrl: 'jen.jpg',
        messageSent: new Date('2022-03-27'),
        dateRead:  new Date('2022-03-27'),
        content: 'ignoring me?'
    }];

    beforeEach(waitForAsync(() => {

        messageServiceStub = jasmine.createSpyObj('AccountsService', ['sendMessage', 'logout']);

        TestBed.configureTestingModule({
            imports: [MemberMessagesComponent, HttpClientTestingModule],
            providers: [
                TimeagoFormatter, 
                { provide: MessageService, useValue: messageServiceStub },
                { provide: TimeagoClock, useValue: { tick: () => of(null) } },
            ],
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(MemberMessagesComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
        });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('when 3 messages exist for bob', () => {
        beforeEach(() => {
            component.username = 'Bob';
            component.messages = messagesStub;
            fixture.detectChanges();
        });

        it('should display the list of messages', () => {
            const messageItems = el.queryAll(By.css('ul.chat li'));
            expect(messageItems.length).toBe(3);
        })
    });

    describe('when no messages exist for bob', () => {
        beforeEach(() => {
            component.username = 'Bob';
            component.messages = [];
            fixture.detectChanges();
        });

        it('should NOT display the list of messages', () => {    
            const messageList = el.queryAll(By.css('ul.chat'));
            expect(messageList.length).toBe(0);
        })

        it('should display the text that there are no messages', () => {
            const messageItems = el.query(By.css('.no-messages'));
            const textWarning: HTMLElement = messageItems.nativeElement;
            expect(textWarning?.textContent).toContain('No messages yet...');
        });
    });
});