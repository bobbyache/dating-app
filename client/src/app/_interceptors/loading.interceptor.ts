import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, identity, Observable } from 'rxjs';
import { BusyService } from '../_services/busy.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy();
    
    return next.handle(request).pipe(
      // Once this change is made note how fast your code runs (without the delay) on port 5001
      // but when you serve locally on port 4200 the delay is there to simulate a slower network
      // call.
      (environment.production ? identity : delay(1000)),
      finalize(() => {
        this.busyService.idle()
      })
    );
  }
}
