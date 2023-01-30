using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository userRepository;

    public UsersController(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        return Ok(await userRepository.GetUsersAsync());
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        return await userRepository.GetUserByUsernameAsync(username);
    }
}
