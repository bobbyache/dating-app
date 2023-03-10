using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
    private readonly IPhotoService photoService;

    public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    {
        this.mapper = mapper;
        this.photoService = photoService;
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
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return NotFound();

        mapper.Map(memberUpdateDto, user);

        //
        // This is the correct response to return for an HttpPut.
        // everything was ok, but I've got nothing more to send back to you.
        // the client should have the information as to what they've changed.
        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            // Is this the first photo? If so, set it to the main photo.
            IsMain = user.Photos.Count == 0 ? true : false
        };

        user.Photos.Add(photo);

        //
        // Create a 201 Created response with some information as to where to find the resource (HATEOS).
        // ... and we send back the newly created resource url in the Location header.
        if (await userRepository.SaveAllAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { username = user.Username }, mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("Problem adding photo");
    }

    //
    // TODO: (Rob) this should be patch
    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null) return NotFound();

        if (photo.IsMain) return BadRequest("this is already your main photo");

        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMain != null) currentMain.IsMain = false;

        photo.IsMain = true;

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Problem setting the main photo");
    }
}
