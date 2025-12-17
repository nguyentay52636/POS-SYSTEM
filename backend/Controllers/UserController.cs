using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// User management and authentication endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Users")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;
    private readonly IJwtService _jwtService;

    public UserController(IUserService service, IJwtService jwtService)
    {
        _service = service;
        _jwtService = jwtService;
    }

    /// <summary>
    /// List all users (simple, no pagination).
    /// </summary>
    /// <returns>Array of users.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(UserResponseDto[]), StatusCodes.Status200OK)]
    [HttpGet]
    [ProducesResponseType(typeof(UserResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserResponseDto[]>> List([FromQuery] string? status = null)
    {
        var result = await _service.ListAllAsync(status);
        return Ok(result);
    }

    /// <summary>
    /// List all users (no filters).
    /// </summary>
    [HttpGet("all")]
    [ProducesResponseType(typeof(UserResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserResponseDto[]>> GetAll()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get users by status.
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(UserResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserResponseDto[]>> GetByStatus(string status)
    {
        var result = await _service.ListAllAsync(status);
        return Ok(result);
    }
    
    /// <summary>
    /// Toggle user status (active/inactive)
    /// </summary>
    [HttpPut("{id:int}/status")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> ToggleStatus(int id)
    {
        try
        {
            var updated = await _service.ToggleStatusAsync(id);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Search users with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<UserResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<UserResponseDto>>> Search([FromQuery] UserQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get a user by id.
    /// </summary>
    /// <param name="id">User id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> GetById(int id)
    {
        var user = await _service.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    /// <summary>
    /// Create a new user.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            
            // Password hashing is handled in UserService.CreateAsync (Lines 70-71)

            // Generate JWT token
            var (token, expiresAt) = _jwtService.GenerateToken(
                created.Username ?? string.Empty,
                created.UserId.ToString(),
                created.RoleName
            );

            // Return user + token
            return CreatedAtAction(nameof(GetById), new { id = created.UserId }, new 
            {
                User = created,
                Token = token,
                ExpiresAt = expiresAt
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing user.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a user by id.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Bulk import users from a JSON array.
    /// </summary>
    [HttpPost("import-json")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ImportJson([FromBody] IEnumerable<CreateUserDto> users)
    {
        var count = await _service.ImportAsync(users);
        return Ok(new { inserted = count });
    }
}


