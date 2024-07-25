using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly DataContext context;
    private readonly ITokenService tokenService;
    private readonly IMapper mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
        this.tokenService = tokenService;
        this.mapper = mapper;
        this.context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        var user = mapper.Map<AppUser>(registerDto);       

        user.UserName = registerDto.Username.ToLower();

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.Include(u => u.Photos).SingleOrDefaultAsync(usr => usr.UserName == loginDto.Username.ToLower());
        if (user is null) return Unauthorized("Invalid username");

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }


    private async Task<bool> UserExists(string username) => await context.Users.AnyAsync(usr => usr.UserName.ToLower() == username.ToLower());
}
