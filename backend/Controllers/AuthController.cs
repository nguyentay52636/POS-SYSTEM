using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
using backend.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    /// <summary>
    /// Authentication controller for user login
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Authenticate a user and return a JWT token
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>Login response with JWT token and user information</returns>
        /// <response code="200">Login successful</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Invalid username or password</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request data", errors = ModelState });
            }

            var result = await _authService.LoginAsync(loginDto);

            if (result == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(result);
        }

        /// <summary>
        /// Register a new user and return a JWT token
        /// </summary>
        /// <param name="registerDto">Registration information</param>
        /// <returns>Registration response with JWT token and user information</returns>
        /// <response code="200">Registration successful</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="409">Username already exists</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request data", errors = ModelState });
            }

            var result = await _authService.RegisterAsync(registerDto);

            if (result == null)
            {
                return Conflict(new { message = "Username already exists" });
            }

            return Ok(result);
        }

        /// <summary>
        /// Health check endpoint for authentication service
        /// </summary>
        /// <returns>Service status</returns>
        [HttpGet("health")]
        [ProducesResponseType(200)]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", service = "AuthController" });
        }

        /// <summary>
        /// Change user password (requires JWT authentication)
        /// </summary>
        /// <param name="changePasswordDto">Old password, new password and confirmation</param>
        /// <returns>Result of password change operation</returns>
        /// <response code="200">Password changed successfully</response>
        /// <response code="400">Invalid request data or password validation failed</response>
        /// <response code="401">User not authenticated</response>
        [Authorize]
        [HttpPost("change-password")]
        [ProducesResponseType(typeof(ChangePasswordResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request data", errors = ModelState });
            }

            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result);
        }
    }
}
