import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { MessageService } from "./message.service";
import { environment } from '../../environments/environment';
import { HttpRequest } from "@angular/common/http";

describe('MembersService', () => {
    let httpTestingController: HttpTestingController
    let messageService: MessageService

    beforeEach(() => {
        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [
                // Always pass the service you want to test here....
                MessageService
            ]
        })

        messageService = TestBed.inject(MessageService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should have a baseUrl', () => {
        expect(messageService.baseUrl).toBe(environment.apiUrl)
    });

    describe('when getting paginated messages', () => {

        it('should get a page of messages', () => {
            messageService.getMessages('Unread', 2, 10)
                .subscribe(messages => {
                    expect(messages).toBeTruthy();    
                });
    
            // Ensure the URL directly matches (without query params etc.)
            // https://localhost:5001/api/messages?pageNumber=2&pageSize=10&Container=Unread
            const req = httpTestingController
                .expectOne(req => req.url == environment.apiUrl + 'messages');
            expect(req.request.method).toBe('GET');

            // Expect that there are query parameters and that they match the values passed in to the service call
            expect(req.request.params.get('Container'))
                .withContext('Expect the container query parameter to be a certain value').toEqual('Unread');
            expect(req.request.params.get('pageNumber'))
                .withContext('Expect the container query parameter to be a certain value').toEqual('2');
            expect(req.request.params.get('pageSize'))
                .withContext('Expect the container query parameter to be a certain value').toEqual('10');

            // Ensure the authorization header is present on the request
            expect(req.request.headers.has('Authorization'));
            
            httpTestingController.verify();
        });
    });
});
