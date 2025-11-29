using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IRolePermissionService
{
    Task<IReadOnlyList<RolePermissionResponseDto>> GetByRoleIdAsync(int roleId);
    Task<RolePermissionResponseDto> CreateOrUpdateAsync(int roleId, CreateRolePermissionDto dto);
    Task UpdateBulkAsync(int roleId, BulkUpdateRolePermissionDto dto);
}

public class RolePermissionService : IRolePermissionService
{
    private readonly IRolePermissionRepository _repo;
    private readonly IMapper _mapper;

    public RolePermissionService(IRolePermissionRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<RolePermissionResponseDto>> GetByRoleIdAsync(int roleId)
    {
        var items = await _repo.GetByRoleIdAsync(roleId);
        return _mapper.Map<IReadOnlyList<RolePermissionResponseDto>>(items);
    }

    public async Task<RolePermissionResponseDto> CreateOrUpdateAsync(int roleId, CreateRolePermissionDto dto)
    {
        var existing = await _repo.GetAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
        if (existing != null)
        {
            existing.IsAllowed = dto.IsAllowed;
            await _repo.UpdateAsync(existing);
            return _mapper.Map<RolePermissionResponseDto>(existing);
        }
        else
        {
            var newPermission = new RolePermission
            {
                RoleId = roleId,
                FeatureId = dto.FeatureId,
                PermissionTypeId = dto.PermissionTypeId,
                IsAllowed = dto.IsAllowed
            };
            await _repo.AddAsync(newPermission);
            // Re-fetch to include navigation properties for mapping
            var created = await _repo.GetAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
            return _mapper.Map<RolePermissionResponseDto>(created);
        }
    }

    public async Task UpdateBulkAsync(int roleId, BulkUpdateRolePermissionDto dto)
    {
        foreach (var permissionDto in dto.Permissions)
        {
            await CreateOrUpdateAsync(roleId, permissionDto);
        }
    }
}
