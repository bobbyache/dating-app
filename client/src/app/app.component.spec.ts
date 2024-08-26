import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavComponent } from './nav/nav.component';
import { AccountsService } from './_services/accounts.service';
import { PresenceService } from './_services/presence.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppModule } from './app.module';

describe('AppComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppModule,
                RouterTestingModule, 
                HttpClientTestingModule, 
                ToastrModule,
                NgxSpinnerModule.forRoot({ type: 'line-scale-party' }), 
            ],
            declarations: [AppComponent, NavComponent]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should display the correct title`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('Dating App');
    });
});
