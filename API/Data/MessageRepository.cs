using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly IMapper mapper;

        public DataContext context { get; }
        public MessageRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
                _ => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null),
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Include(u => u.Sender).ThenInclude(s => s.Photos)
                .Include(u => u.Recipient).ThenInclude(r => r.Photos)
                .Where(
                    //
                    // Fetch both sides of the message thread
                    m => m.RecipientUsername == currentUsername &&
                        m.SenderUsername == recipientUsername ||
                        m.RecipientUsername == recipientUsername &&
                        m.SenderUsername == currentUsername
                )
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            //
            // If there are any unread messages (from the point of view of the logged in user) make sure to mark them as read.
            //
            // TODO: (Rob) This appears to be a violation of CQRS style approach and the single responsibility
            // paradigm. Would prefer this in a seperate method? However, it works most efficiently for this purpose.
            var unreadMessages = messages.Where(m => m.DateRead == null &&
                m.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await context.SaveChangesAsync();
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}