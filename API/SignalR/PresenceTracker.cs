using System.Reflection;

namespace API.SignalR;

public class PresenceTracker
{
    // Note: This solution does not scale well. However, it's a good prototypical example of the 
    // idea behind  tracking the history of user's online presence. A better place to store this
    // may be in a key/value datastore that supports scaling and consistency levels such as
    // CosmosDB.

    // Users can connect from more than one device (at the same time). Only interested in whether
    // they're connected to one or more devices we consider them to be online.
    private static readonly Dictionary<string, List<string>> onlineUsers = new Dictionary<string, List<string>>();

    public Task UserConnected(string username, string connectionId)
    {
        // A dictionary is not a thread-safe contruct.  Multiple concurrent users accessing the
        // dictionary at the same time could cause issues, so use a lock. Not very scalable but
        // good enough for a prototype in the absence of a more scalable service. It could become
        // a bottleneck.
        lock (onlineUsers)
        {
            if (onlineUsers.ContainsKey(username))
            {
                onlineUsers[username].Add(connectionId);
            }
            else
            {
                onlineUsers.Add(username, new List<string>{connectionId});
            }
        }

        return Task.CompletedTask;
    }

    public Task UserDisconnected(string username, string connectionId)
    {
        lock (onlineUsers)
        {
            if (!onlineUsers.ContainsKey(username)) return Task.CompletedTask;

            onlineUsers[username].Remove(connectionId);
            if (onlineUsers[username].Count == 0)
            {
                onlineUsers.Remove(username);
            }
        }

        return Task.CompletedTask;
    }

    public Task<string[]> GetOnlineUsers()
    {
        string[] users;

        lock(onlineUsers)
        {
            users = onlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
        }

        return Task.FromResult(users);
    }

    public static Task<List<string>> GetConnectionsForUser(string username)
    {
        List<string> connectionIds;

        lock(onlineUsers)
        {
            connectionIds = onlineUsers.GetValueOrDefault(username);
        }

        return Task.FromResult(connectionIds);
    }
}
