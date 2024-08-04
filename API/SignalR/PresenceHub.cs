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
        var isOnline = await tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
        if (isOnline)
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

        var currentUsers = await tracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var isOffline = await tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

        if (isOffline)
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
        
        // Since we're passing through an exception, we also need to call the base method.
        await base.OnDisconnectedAsync(exception);
    }
}
