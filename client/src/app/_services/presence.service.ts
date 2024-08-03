import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  constructor(private toastr: ToastrService) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
    })
    // Backoff-retry
    // Here are useful articles: 
    // https://github.com/peter-csala/resilience-service-design/blob/main/resilience.md
    // https://stackoverflow.com/questions/74875520/what-is-the-difference-between-circuit-breaker-and-retry-in-spring-boot-microser
    .withAutomaticReconnect()
    .build();
    
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.toastr.info(username + ' has connected');
    });

    this.hubConnection.on('UserIsOffline', username => {
      this.toastr.info(username + ' has disconnected');
    });
  }
  
  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
