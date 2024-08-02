import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { AppModule } from "../app.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

fdescribe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let el: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                ToastrModule.forRoot({
                    positionClass: 'toast-bottom-right',
                })
            ],
            declarations: [
                NavComponent
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