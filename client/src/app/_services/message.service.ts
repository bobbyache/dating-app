import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    baseUrl = environment.apiUrl;
    hubUrl = environment.hubUrl;
    private hubConnection?: HubConnection
    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();


    constructor(private http: HttpClient) {}

    createHubConnection(user: User, otherUsername: string) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
                accessTokenFactory: () => user.token
            })
            .withAutomaticReconnect()
            .build();
        
        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('ReceiveMessageThread', messages => {
            this.messageThreadSource.next(messages);
        });

        this.hubConnection.on('NewMessage', message => {
            // Don't mutate the array. The spread operator will replace
            // the array rather than mutate it (pushing/appending to it)
            this.messageThread$.pipe(take(1)).subscribe({
                next: messages => {
                    this.messageThreadSource.next([...messages, message]);
                }
            });
        });
    }

    stopHubConnection() {
        if (this.hubConnection) this.hubConnection?.stop();
    }

    getMessages(container: string, pageNumber: number, pageSize: number) {
        let params = getPaginationHeaders(pageNumber, pageSize);
        params = params.append('Container', container);

        return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
    }

    getMessageThread(username: string) {
        return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }

    // async guarantees that we will get a promise from this method.
    // although in this case this is what the invoke() says it will do!
    async sendMessage(username: string, content: string) {
        return this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content })
            .catch(error => console.log(error));
    }

    deleteMessage(id: number) {
        return this.http.delete(this.baseUrl + 'messages/' + id);
    }
}
