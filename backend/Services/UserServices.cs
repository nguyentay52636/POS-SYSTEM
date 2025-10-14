using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public interface IUserService
{
    Task<UserResponseDto> CreateAsync(CreateUserDto dto);
    Task<UserResponseDto?> GetByIdAsync(int id);
    Task<UserResponseDto?> GetByUsernameAsync(string username);
    Task<UserResponseDto?> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<UserResponseDto>> SearchAsync(UserQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreateUserDto> users);
    Task<UserResponseDto[]> ListAllAsync();
}

public class UserService : IUserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo)
    {
        _repo = repo;
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Password = dto.Password, // In production, hash the password
            FullName = dto.FullName,
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "staff" : dto.Role,
            CreatedAt = DateTime.UtcNow
        };

        user = await _repo.CreateAsync(user);
        return Map(user);
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        return user == null ? null : Map(user);
    }

    public async Task<UserResponseDto?> GetByUsernameAsync(string username)
    {
        var user = await _repo.GetByUsernameAsync(username);
        return user == null ? null : Map(user);
    }

    public async Task<UserResponseDto?> UpdateAsync(int id, UpdateUserDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Password)) existing.Password = dto.Password;
        if (!string.IsNullOrWhiteSpace(dto.FullName)) existing.FullName = dto.FullName;
        if (!string.IsNullOrWhiteSpace(dto.Role)) existing.Role = dto.Role;

        var updated = await _repo.UpdateAsync(existing);
        return Map(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

    public async Task<PagedResponse<UserResponseDto>> SearchAsync(UserQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<UserResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = items.Select(Map).ToArray()
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateUserDto> users)
    {
        int inserted = 0;
        foreach (var dto in users)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                continue;
            }
            var exists = await _repo.GetByUsernameAsync(dto.Username);
            if (exists != null) continue;
            await CreateAsync(dto);
            inserted++;
        }
        return inserted;
    }

    public async Task<UserResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return items.Select(Map).ToArray();
    }

    private static UserResponseDto Map(User user)
    {
        return new UserResponseDto
        {
            UserId = user.UserId,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
}


