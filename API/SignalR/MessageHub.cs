using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub : Hub
{
    private readonly IMessageRepository messageRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository, 
        IMapper mapper)
    {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext.Request.Query["user"];
        var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await AddToGroup(groupName);

        // On connection, and just having created a group, we'll get the message thread 
        // (for this user pair) via SignalR. 
        var messages = await messageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);
        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        // When a user disconnects from this hub by moving to another part of the application 
        // they will be automatically removed from any groups they are connected to on this hub.
        await RemoveFromMessageGroup();
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
            var username = Context.User.GetUsername();

            if (username == createMessageDto.RecipientUsername.ToLower())
                throw new HubException("You cannot send messages to yourself");

            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recipient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("User not found");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);
            var group = await messageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            
            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
    }

    private string GetGroupName(string caller, string other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }

    private async Task<bool> AddToGroup(string groupName)
    {
        var group = await messageRepository.GetMessageGroup(groupName);
        var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

        if (group == null)
        {
            group = new Group(groupName);
            messageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        return await messageRepository.SaveAllAsync();
    }

    private async Task RemoveFromMessageGroup()
    {
        var connection = await messageRepository.GetConnection(Context.ConnectionId);
        messageRepository.RemoveConnection(connection);
        await messageRepository.SaveAllAsync();

    }
}
