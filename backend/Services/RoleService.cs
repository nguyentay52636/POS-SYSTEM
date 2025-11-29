using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IRoleService
{
    Task<RoleResponseDto> CreateAsync(CreateRoleDto dto);
    Task<RoleResponseDto?> GetByIdAsync(int id);
    Task<RoleResponseDto?> UpdateAsync(int id, UpdateRoleDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IReadOnlyList<RoleResponseDto>> ListAllAsync();
}

public class RoleService : IRoleService
{
    private readonly IRoleRepository _repo;
    private readonly IMapper _mapper;

    public RoleService(IRoleRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<RoleResponseDto> CreateAsync(CreateRoleDto dto)
    {
        var role = _mapper.Map<Role>(dto);
        role = await _repo.CreateAsync(role);
        return _mapper.Map<RoleResponseDto>(role);
    }

    public async Task<RoleResponseDto?> GetByIdAsync(int id)
    {
        var role = await _repo.GetByIdAsync(id);
        return role == null ? null : _mapper.Map<RoleResponseDto>(role);
    }

    public async Task<RoleResponseDto?> UpdateAsync(int id, UpdateRoleDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<RoleResponseDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    public async Task<IReadOnlyList<RoleResponseDto>> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<IReadOnlyList<RoleResponseDto>>(items);
    }
}
