import { TestBed } from "@angular/core/testing";
import { BusyService } from "./busy.service";
import { NgxSpinnerService } from "ngx-spinner";

fdescribe('BusyService', () => {
    let service: BusyService;
    let spinnerServiceSpy: any;

    beforeEach(() => {
        spinnerServiceSpy = jasmine.createSpyObj(['show', 'hide']);

        TestBed.configureTestingModule({
            providers: [
                BusyService,
                { provide: NgxSpinnerService, useValue: spinnerServiceSpy }
            ]
        });

        service = TestBed.inject(BusyService)
    });

    describe('when something else is busy and one is no longer busy', () => {
        it('should increment to 2', () => {
            service.busy();
            service.busy();
            service.idle();
            expect(service.busyRequestCount).toBe(1);
        });
    });

    describe('when busy', () => {
        
        it('should increment by 1', () => {
            service.busy();
            expect(service.busyRequestCount).toBe(1);
        });

        it('should invoke the spinner', () => {
            service.busy();
            expect(spinnerServiceSpy.show).toHaveBeenCalledTimes(1);
        });

        describe('when something else is busy', () => {
            it('should increment to 2', () => {
                service.busy();
                service.busy();
                expect(service.busyRequestCount).toBe(2);
            });
        })

        describe('when nothing is busy and made idle', () => {
            it('should not increment below 0', () => {
                service.idle();
                service.idle();
                expect(service.busyRequestCount).toBe(0);
            });
        })
    });

    describe('when idle', () => {
        it('should revoke the spinner', () => {
            service.busy();
            service.idle();
            expect(spinnerServiceSpy.show).toHaveBeenCalledTimes(1);
            expect(spinnerServiceSpy.hide).toHaveBeenCalledTimes(1);
        });
    });
});
