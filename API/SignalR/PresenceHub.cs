using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class PresenceHub : Hub
{
    public override async Task OnConnectedAsync()
    {

        await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
        
        // Since we're passing through an exception, we also need to call the base method.
        await base.OnDisconnectedAsync(exception);
    }
}
