using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public interface IValidationService
{
    Task<ValidationResult> ValidateCreateUserAsync(CreateUserDto dto);
    Task<ValidationResult> ValidateUpdateUserAsync(int id, UpdateUserDto dto);
    Task<ValidationResult> ValidateUsernameExistsAsync(string username, int? excludeUserId = null);
}

public class ValidationService : IValidationService
{
    private readonly IUserRepository _userRepository;

    public ValidationService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<ValidationResult> ValidateCreateUserAsync(CreateUserDto dto)
    {
        var result = new ValidationResult();

        // Check if username already exists
        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username);
        if (existingUser != null)
        {
            result.AddError("Username", "Username already exists");
        }

        // Validate role
        if (!string.IsNullOrWhiteSpace(dto.Role) && !IsValidRole(dto.Role))
        {
            result.AddError("Role", "Invalid role. Must be 'admin' or 'staff'");
        }

        return result;
    }

    public async Task<ValidationResult> ValidateUpdateUserAsync(int id, UpdateUserDto dto)
    {
        var result = new ValidationResult();

        // Check if user exists
        var existingUser = await _userRepository.GetByIdAsync(id);
        if (existingUser == null)
        {
            result.AddError("UserId", "User not found");
            return result;
        }

        // Validate role if provided
        if (!string.IsNullOrWhiteSpace(dto.Role) && !IsValidRole(dto.Role))
        {
            result.AddError("Role", "Invalid role. Must be 'admin' or 'staff'");
        }

        return result;
    }

    public async Task<ValidationResult> ValidateUsernameExistsAsync(string username, int? excludeUserId = null)
    {
        var result = new ValidationResult();
        var existingUser = await _userRepository.GetByUsernameAsync(username);

        if (existingUser != null && existingUser.UserId != excludeUserId)
        {
            result.AddError("Username", "Username already exists");
        }

        return result;
    }

    private static bool IsValidRole(string role)
    {
        return role.Equals("admin", StringComparison.OrdinalIgnoreCase) ||
               role.Equals("staff", StringComparison.OrdinalIgnoreCase);
    }
}

public class ValidationResult
{
    public bool IsValid => !Errors.Any();
    public Dictionary<string, List<string>> Errors { get; } = new();

    public void AddError(string field, string message)
    {
        if (!Errors.ContainsKey(field))
        {
            Errors[field] = new List<string>();
        }
        Errors[field].Add(message);
    }

    public string GetErrorMessage()
    {
        return string.Join("; ", Errors.SelectMany(e => e.Value));
    }
}
