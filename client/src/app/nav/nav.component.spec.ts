import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { DebugElement } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AccountsService } from "../_services/accounts.service";
import { Router } from "@angular/router";

fdescribe('NavComponent', () => {
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
});