namespace API.Interfaces;


// Why? We're we're using repo.SaveChanges() on each repository. However, SaveChanges() works across the entire
// DbContext. The UnitOfWork pattern goes hand-in-hand with the repository pattern. The UnitOfWork gives you
// acess to the entire database. Its transactional. Advocates of using the MediatR (CQRS) toolset and approach
// argue that the repository/unit of work pattern is not required.
// From this implementation, you can access all repositories and call HasChanges() in a singly easily accessed
// unit of work.

// Important: Using this pattern, its dangerous to call SaveChanges() within your repositories. It is not the 
// job of the repository to save changes... it is the job of the Unit of Work implementation.
public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikesRepository LikesRepository { get; }

    Task<bool> Complete();
    bool HasChanges();
}
