using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await userRepository.GetMembersAsync();
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        return await userRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        // var username = User.Identity.Name;
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await userRepository.GetUserByUsernameAsync(username);

        if (user == null) return NotFound();

        mapper.Map(memberUpdateDto, user);

        //
        // This is the correct response to return for an HttpPut.
        // everything was ok, but I've got nothing more to send back to you.
        // the client should have the information as to what they've changed.
        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }
}
