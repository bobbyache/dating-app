import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { AppModule } from "../app.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";

fdescribe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let el: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, NoopAnimationsModule],
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