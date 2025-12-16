using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;
using BCrypt.Net;

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
    Task<UserResponseDto[]> ListAllAsync(string? status = null);
    Task<UserResponseDto> ToggleStatusAsync(int id);
}

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidationService _validationService;

    public UserService(IUserRepository repo, IMapper mapper, IValidationService validationService)
    {
        _repo = repo;
        _mapper = mapper;
        _validationService = validationService;
    }

    public async Task<UserResponseDto[]> ListAllAsync(string? status = null)
    {
        var items = await _repo.ListAllAsync(status);
        return _mapper.Map<UserResponseDto[]>(items);
    }

    public async Task<UserResponseDto> ToggleStatusAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {id} not found");

        user.Status = user.Status == "active" ? "inactive" : "active";
        
        var updated = await _repo.UpdateAsync(user);
        
        // Reload to get Role if needed
        var reloaded = await _repo.GetByIdAsync(id); 
        return _mapper.Map<UserResponseDto>(reloaded ?? updated);
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        // Validate business rules
        var validation = await _validationService.ValidateCreateUserAsync(dto);
        if (!validation.IsValid)
        {
            throw new ArgumentException(validation.GetErrorMessage());
        }

        var user = _mapper.Map<User>(dto);
        // Hash password using BCrypt before saving
        user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user = await _repo.CreateAsync(user);
        // Reload with Role navigation property
        var created = await _repo.GetByIdAsync(user.UserId);
        return _mapper.Map<UserResponseDto>(created ?? user);
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        return user == null ? null : _mapper.Map<UserResponseDto>(user);
    }

    public async Task<UserResponseDto?> GetByUsernameAsync(string username)
    {
        var user = await _repo.GetByUsernameAsync(username);
        return user == null ? null : _mapper.Map<UserResponseDto>(user);
    }

    public async Task<UserResponseDto?> UpdateAsync(int id, UpdateUserDto dto)
    {
        // Validate business rules
        var validation = await _validationService.ValidateUpdateUserAsync(id, dto);
        if (!validation.IsValid)
        {
            throw new ArgumentException(validation.GetErrorMessage());
        }

        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        _mapper.Map(dto, existing);
        // Hash password if it was provided
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            existing.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }
        var updated = await _repo.UpdateAsync(existing);
        // Reload with Role navigation property
        var reloaded = await _repo.GetByIdAsync(id);
        return _mapper.Map<UserResponseDto>(reloaded ?? updated);
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
            Items = _mapper.Map<UserResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateUserDto> users)
    {
        var validUsers = new List<User>();

        foreach (var dto in users)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                continue;

            var validation = await _validationService.ValidateCreateUserAsync(dto);
            if (validation.IsValid)
            {
                var user = _mapper.Map<User>(dto);
                // Hash password using BCrypt before saving
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                validUsers.Add(user);
            }
        }

        if (validUsers.Any())
        {
            // Bulk insert would be more efficient here
            foreach (var user in validUsers)
            {
                await _repo.CreateAsync(user);
            }
        }

        return validUsers.Count;
    }


}


