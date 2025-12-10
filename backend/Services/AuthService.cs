using System.Threading.Tasks;
using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Enums;
using BCrypt.Net;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        Task<RegisterResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<ChangePasswordResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepository, IJwtService jwtService, IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            // Find user by username
            var user = await _userRepository.GetByUsernameAsync(loginDto.Username);

            if (user == null)
            {
                return null;
            }

            // Verify password using BCrypt
            if (string.IsNullOrEmpty(user.Password))
            {
                return null;
            }

            try
            {
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                {
                    return null;
                }
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Password is not a valid BCrypt hash (e.g., plain text from old data)
                // This should not happen if all passwords are properly hashed
                return null;
            }

            // Get role string from role enum value
            // Assuming user.Role is now a navigation property to a Role object
            // Role = user.RoleId,Id is the foreign key.
            // The UserResponseDto mapping needs to be explicit or adjusted.
            var roleString = UserRoleHelper.GetRoleName(user.RoleId);

            // Generate JWT token
            var (token, expiresAt) = _jwtService.GenerateToken(
                user.Username ?? string.Empty,
                user.UserId.ToString(),
                roleString
            );

            // Map user to response DTO
            var userResponse = _mapper.Map<UserResponseDto>(user);

            return new LoginResponseDto
            {
                Token = token,
                User = userResponse,
                ExpiresAt = expiresAt
            };
        }

        public async Task<RegisterResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            // Check if username already exists
            var existingUser = await _userRepository.GetByUsernameAsync(registerDto.Username);
            if (existingUser != null)
            {
                return null; // Username already taken
            }

            // Hash password using BCrypt
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Create new user
            var newUser = new User
            {
                Username = registerDto.Username,
                Password = hashedPassword,
                FullName = registerDto.FullName ?? registerDto.Username,
                RoleId = (int)UserRole.Customer, // Default role is Customer
                CreatedAt = DateTime.UtcNow
            };

            // Save user to database
            var createdUser = await _userRepository.CreateAsync(newUser);

            // Get role string from role enum value
            var roleString = UserRoleHelper.GetRoleName(createdUser.RoleId);

            // Generate JWT token
            var (token, expiresAt) = _jwtService.GenerateToken(
                createdUser.Username ?? string.Empty,
                createdUser.UserId.ToString(),
                roleString
            );

            // Map user to response DTO
            var userResponse = _mapper.Map<UserResponseDto>(createdUser);

            return new RegisterResponseDto
            {
                Token = token,
                User = userResponse,
                ExpiresAt = expiresAt,
                Message = "Registration successful"
            };
        }

        public async Task<ChangePasswordResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            // Find user by ID from JWT token
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return new ChangePasswordResponseDto
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            // Verify old password
            if (string.IsNullOrEmpty(user.Password))
            {
                return new ChangePasswordResponseDto
                {
                    Success = false,
                    Message = "Invalid old password"
                };
            }

            try
            {
                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.OldPassword, user.Password))
                {
                    return new ChangePasswordResponseDto
                    {
                        Success = false,
                        Message = "Old password is incorrect"
                    };
                }
            }
            catch (BCrypt.Net.SaltParseException)
            {
                return new ChangePasswordResponseDto
                {
                    Success = false,
                    Message = "Invalid old password format"
                };
            }

            // Check if new password is the same as old password
            if (changePasswordDto.OldPassword == changePasswordDto.NewPassword)
            {
                return new ChangePasswordResponseDto
                {
                    Success = false,
                    Message = "New password must be different from old password"
                };
            }

            // Hash new password
            var hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

            // Update password
            user.Password = hashedNewPassword;
            await _userRepository.UpdateAsync(user);

            return new ChangePasswordResponseDto
            {
                Success = true,
                Message = "Password changed successfully"
            };
        }
    }
}
