// import { TestBed } from "@angular/core/testing";
// import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
// import { AdminService } from "./admin.service";
// import { User } from "../_models/user";
// import { HttpClient } from "@angular/common/http";
// import * as testData from "../_testdata/users-and-roles.json";

// describe('MembersService', () => {
//     let httpClient: HttpClient;
//     let httpTestingController: HttpTestingController
//     let adminService: AdminService

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule],
//             providers: [
//                 AdminService
//             ]
//         })

//         httpClient = TestBed.inject(HttpClient);
//         adminService = TestBed.inject(AdminService);
//         httpTestingController = TestBed.inject(HttpTestingController);
//     });

//     describe('when fetching users with roles', () => {
        
//         it('should expect a single call to be made', () => {
//             adminService.getUsersWithRoles()
//                 .subscribe(data => {
//                     console.log(data);
//                     expect(data).toEqual(testData);
//                 });

//             // The following `expectOne()` will match the request's URL.
//             // If no requests or multiple requests matched that URL
//             // `expectOne()` would throw.
//             const req = httpTestingController.expectOne('/admin/users-with-roles');

//             // Assert that the request is a GET and has an auth header.
//             expect(req.request.method).toEqual('GET');
//             expect(req.request.headers.has('Authorization'));

//             // Respond with mock data, causing Observable to resolve.
//             // Subscribe callback asserts that correct data was returned.
//             req.flush(testData);

//             // Assert they are no outstanding tests
//             httpTestingController.verify();
//         });
//     });
// });
