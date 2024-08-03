using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class PresenceHub : Hub
{
    private readonly PresenceTracker tracker;

    public PresenceHub(PresenceTracker tracker)
    {
        this.tracker = tracker;
    }

    public override async Task OnConnectedAsync()
    {
        await tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
        await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

        var currentUsers = await tracker.GetOnlineUsers();
        await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
        await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
        
        var currentUsers = await tracker.GetOnlineUsers();
        await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
        
        // Since we're passing through an exception, we also need to call the base method.
        await base.OnDisconnectedAsync(exception);
    }
}
