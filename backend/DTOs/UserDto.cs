using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateUserDto
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string? FullName { get; set; }

    [StringLength(10, ErrorMessage = "Role cannot exceed 10 characters")]
    public string? Role { get; set; }
}

public class UpdateUserDto
{
    [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
    public string? Password { get; set; }

    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string? FullName { get; set; }

    [StringLength(10, ErrorMessage = "Role cannot exceed 10 characters")]
    public string? Role { get; set; }
}

public class UserResponseDto
{
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string? FullName { get; set; }
    public int Role { get; set; }  // 1 = Admin, 2 = Staff, 0 = Customer
    public string RoleName { get; set; } = string.Empty;  // "admin", "staff", "customer"
    public DateTime? CreatedAt { get; set; }
}

public class UserQueryParams
{
    public string? Keyword { get; set; }
    public string? Username { get; set; }
    public string? Role { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "createdAt"; // createdAt | username | fullName
    public string? SortDir { get; set; } = "desc"; // asc | desc
}

public class PagedResponse<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public T[] Items { get; set; } = Array.Empty<T>();
}

public class LoginDto
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}

public class RegisterDto
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string? FullName { get; set; }
}

public class RegisterResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public string Message { get; set; } = "Registration successful";
}


