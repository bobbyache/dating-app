import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getMessages(container: string, pageNumber: number, pageSize: number) {
        let params = getPaginationHeaders(pageNumber, pageSize);
        params = params.append('Container', container);

        return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
    }

    getMessageThread(username: string) {
        return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }
}
