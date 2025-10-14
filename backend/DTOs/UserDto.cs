using System;

namespace backend.DTOs;

public class CreateUserDto
{
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? FullName { get; set; }
    public string? Role { get; set; }
}

public class UpdateUserDto
{
    public string? Password { get; set; }
    public string? FullName { get; set; }
    public string? Role { get; set; }
}

public class UserResponseDto
{
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string? FullName { get; set; }
    public string? Role { get; set; }
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


