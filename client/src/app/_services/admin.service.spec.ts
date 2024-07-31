import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AdminService } from "./admin.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from '../../environments/environment';
import * as testData from "../_testdata/users-and-roles.json";
import { User } from "../_models/user";

/*
    HttpClient - will make actual calls. Rather use the testing module. Has all the same methods
    as the HttpClient but will mock requests and return test data which will allow us to test
    certain things.

    HttpTestingController - allows us to make assertions against the request once executed.
    TODO: See Udemy Angular Testing Masterclass at this lecture:
        https://www.udemy.com/course/angular-testing-course/learn/lecture/14512728#overview
    Shows how you can use a Partial<User> to update specific fields. May want to put it into effect
    somewhere else.
*/

// TODO: Test to cover updateUserRoles

describe('MembersService', () => {
    let httpTestingController: HttpTestingController
    let adminService: AdminService

    beforeEach(() => {
        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [
                // Always pass the service you want to test here....
                AdminService
            ]
        })

        adminService = TestBed.inject(AdminService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should have a baseUrl', () => {
        expect(adminService.baseUrl).toBe(environment.apiUrl)
    });

    describe('when fetching users with roles', () => {

        it('should expect a single call to be made', () => {
            adminService.getUsersWithRoles().subscribe();
            // Expect the correct endpoint to be called once.
            const req = httpTestingController.expectOne(new URL('admin/users-with-roles', environment.apiUrl).href);

            // Assert that the request is a GET and has an auth header.
            expect(req.request.method).toEqual('GET');
            expect(req.request.headers.has('Authorization'));
            req.flush(testData);
        });

        it('should expect to receive content', () => {
            // Important. You must first "import" into mockData before you can start using testData.
            // Once you have "imported" the JSON, you can then access its data property as an array.
            const mockData = testData;
            const data: User[] = mockData.data;

            const arraysEqual = (arr1: string[], arr2: string[]) =>
                JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());

            adminService.getUsersWithRoles()
                .subscribe(users => {
                    console.log(users);
                    expect(users).toBeTruthy();
                    expect(users).toEqual(data);
                    expect(users.length).withContext('Incorrect number of users with roles').toBe(2);

                    // This will fail if you import the JSON incorrectly and should be a good guard assertion.
                    expect(Array.isArray(data)).withContext('test data returned is not in array format').toBeTruthy();

                    // Assert some things about a user object within the array.
                    const user = users.find(usr => usr.id == 2);
                    expect(user?.username).withContext('Expected the found username to be lisa').toBe('lisa');

                    // Different ways to check arrays
                    expect(user?.roles).withContext('Expected the found username to be lisa').toEqual(['Member','Admin']);
                    expect(arraysEqual(user!.roles, ['Admin', 'Member'])).toBeTruthy();
                });

            // Mock the data being passed back from the HTTP request. Here is where one "pretends" one
            // gets back a specific array of users.
            const req = httpTestingController.expectOne(environment.apiUrl + 'admin/users-with-roles');
            req.flush(data);
        });

        afterEach(() => {
            // Checks that no other HTTP requests are being made other than the expectOne().
            // So if some additional request has been executed this will fail the test.
            httpTestingController.verify();
        });
    });

    describe('when updating user roles', () => {

        it('should save the selected roles', () => {
            const selectedRoles: string[] = ['Admin', 'Member'];

            adminService.updateUserRoles('todd', selectedRoles)
                .subscribe({
                    next: roles => {
                        expect(roles).toEqual(selectedRoles);
                        expect(roles.length).toBe(2);
                    }
                });
            
            // Expect that a call is being made to update the roles for a specific uer.
            const req = httpTestingController.expectOne(environment.apiUrl + 'admin/edit-roles/todd?roles=Admin,Member');

            // TODO: Probably should be a PUT request, but would need to change this on the main branch and squash merge.
            // Ensure this is a POST request with no content in the body
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).withContext('Body of the POST request should have no content').toEqual({});

            // Respond with mock data, causing observable to resolve.
            // Assert that correct data is returned.
            req.flush(selectedRoles);
        });

        it('should return an error if the update fails', () => {
            const selectedRoles: string[] = ['Admin', 'Member'];

            adminService.updateUserRoles('todd', selectedRoles)
                .subscribe({
                    next: () => fail('The update operation should have failed'),
                    error: (err: HttpErrorResponse) => {
                        expect(err.status).toBe(500);
                    }
                });

            // Expect this call to fail with an error code 500. Indirectly ensure that the call has gone to the
            // Observable's Error function. Probably more useful when working with something else.
            const req = httpTestingController.expectOne(environment.apiUrl + 'admin/edit-roles/todd?roles=Admin,Member');
            req.flush('Save course failed', {status:500, statusText: 'Internal Server Error'} );
        });

        afterEach(() => {
            // Checks that no other HTTP requests are being made other than the expectOne().
            // So if some additional request has been executed this will fail the test.
            httpTestingController.verify();
        });
    });
});
