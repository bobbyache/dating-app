import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { DebugElement } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AccountsService } from "../_services/accounts.service";
import { Router } from "@angular/router";

describe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let el: DebugElement;
    let accountServiceStub: Partial<AccountsService>;
    let routerStub: Partial<Router>;

    beforeEach(waitForAsync(() => {

        accountServiceStub = jasmine.createSpyObj('AccountsService', ['login', 'logout']);
        routerStub = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            declarations: [
                NavComponent
            ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: AccountsService, useValue: accountServiceStub }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NavComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
        });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
        console.log('hello world');
        console.log(component);
    });

    describe('when logging in', () => {
        let loginSpy: any;

        beforeEach(() => {
            loginSpy = (accountServiceStub as jasmine.SpyObj<AccountsService>)
                .login.and.returnValue(of());
            // will fail if FormsModule is removed because of ngModel
            // fixture.detectChanges();
            component.login();
        });

        it('should log in through the account service', () => {
            expect(loginSpy).toHaveBeenCalledTimes(1);
        });
        
        it('should navigate to the members area', () => {
            pending();
            // Can't seem to get this right yet... wrapped observable makes this tricky...
            // (accountServiceStub as any).login().subscribe(() => {
            // });
            // expect(routerStub.navigateByUrl).toHaveBeenCalledOnceWith('/members');
        });
    });

    describe('when logging out', () => {
        let logoutSpy: any;

        beforeEach(() => {
            logoutSpy = (accountServiceStub as jasmine.SpyObj<AccountsService>)
                .logout;
            // fixture.detectChanges();
            component.logout();
        });

        it('should navigate to the landing page', () => {
            // pending();
            expect(routerStub.navigateByUrl).toHaveBeenCalledOnceWith('/');
        });

        it('should log out through the account service', () => {
            // pending();
            expect(logoutSpy).toHaveBeenCalledTimes(1);
        });
    });
});