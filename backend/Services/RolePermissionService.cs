using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IRolePermissionService
{
    Task<RolePermissionResponseDto[]> GetAllAsync();
    Task<RolePermissionResponseDto[]> GetByRoleIdAsync(int roleId);
    Task<RolePermissionResponseDto?> GetByIdAsync(int roleId, int featureId, int permissionTypeId);
    Task<RolePermissionResponseDto> CreateOrUpdateAsync(int roleId, CreateRolePermissionDto dto);
    Task<RolePermissionResponseDto> CreateAsync(int roleId, CreateRolePermissionDto dto);
    Task<RolePermissionResponseDto?> UpdateAsync(int roleId, int featureId, int permissionTypeId, CreateRolePermissionDto dto);
    Task<bool> DeleteAsync(int roleId, int featureId, int permissionTypeId);
    Task UpdateBulkAsync(int roleId, BulkUpdateRolePermissionDto dto);
    Task UpdateRolePermissionsAsync(int roleId, UpdateRolePermissionsDto dto);
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

    public async Task<RolePermissionResponseDto[]> GetAllAsync()
    {
        var items = await _repo.GetAllAsync();
        var validItems = items.Where(rp => rp.Feature != null && rp.PermissionType != null);
        return _mapper.Map<RolePermissionResponseDto[]>(validItems);
    }

    public async Task<RolePermissionResponseDto[]> GetByRoleIdAsync(int roleId)
    {
        var items = await _repo.GetByRoleIdAsync(roleId);
        // Filter out items with missing Feature or PermissionType to prevent 500 errors
        var validItems = items.Where(rp => rp.Feature != null && rp.PermissionType != null);
        return _mapper.Map<RolePermissionResponseDto[]>(validItems);
    }

    public async Task<RolePermissionResponseDto?> GetByIdAsync(int roleId, int featureId, int permissionTypeId)
    {
        var item = await _repo.GetByIdAsync(roleId, featureId, permissionTypeId);
        return item == null ? null : _mapper.Map<RolePermissionResponseDto>(item);
    }

    public async Task<RolePermissionResponseDto> CreateOrUpdateAsync(int roleId, CreateRolePermissionDto dto)
    {
        var existing = await _repo.GetAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
        if (existing != null)
        {
            // Create a new instance for update (since GetAsync uses AsNoTracking)
            var toUpdate = new RolePermission
            {
                RoleId = roleId,
                FeatureId = dto.FeatureId,
                PermissionTypeId = dto.PermissionTypeId,
                IsAllowed = dto.IsAllowed
            };
            await _repo.UpdateAsync(toUpdate);
            // Re-fetch to include navigation properties for mapping
            var updated = await _repo.GetByIdAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
            return _mapper.Map<RolePermissionResponseDto>(updated!);
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
            var created = await _repo.GetByIdAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
            return _mapper.Map<RolePermissionResponseDto>(created!);
        }
    }

    public async Task<RolePermissionResponseDto> CreateAsync(int roleId, CreateRolePermissionDto dto)
    {
        // Check if already exists
        var existing = await _repo.GetAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
        if (existing != null)
        {
            throw new System.ArgumentException($"Permission already exists for Role {roleId}, Feature {dto.FeatureId}, PermissionType {dto.PermissionTypeId}");
        }

        var newPermission = new RolePermission
        {
            RoleId = roleId,
            FeatureId = dto.FeatureId,
            PermissionTypeId = dto.PermissionTypeId,
            IsAllowed = dto.IsAllowed
        };
        await _repo.AddAsync(newPermission);
        
        // Re-fetch to include navigation properties for mapping
        var created = await _repo.GetByIdAsync(roleId, dto.FeatureId, dto.PermissionTypeId);
        return _mapper.Map<RolePermissionResponseDto>(created!);
    }

    public async Task<RolePermissionResponseDto?> UpdateAsync(int roleId, int featureId, int permissionTypeId, CreateRolePermissionDto dto)
    {
        var existing = await _repo.GetAsync(roleId, featureId, permissionTypeId);
        if (existing == null) return null;

        // Create a new instance for update (since GetAsync uses AsNoTracking)
        var toUpdate = new RolePermission
        {
            RoleId = roleId,
            FeatureId = featureId,
            PermissionTypeId = permissionTypeId,
            IsAllowed = dto.IsAllowed
        };
        await _repo.UpdateAsync(toUpdate);
        
        // Re-fetch to include navigation properties
        var updated = await _repo.GetByIdAsync(roleId, featureId, permissionTypeId);
        return _mapper.Map<RolePermissionResponseDto>(updated!);
    }

    public async Task<bool> DeleteAsync(int roleId, int featureId, int permissionTypeId)
    {
        return await _repo.DeleteAsync(roleId, featureId, permissionTypeId);
    }

    public async Task UpdateBulkAsync(int roleId, BulkUpdateRolePermissionDto dto)
    {
        foreach (var permissionDto in dto.Permissions)
        {
            await CreateOrUpdateAsync(roleId, permissionDto);
        }
    }

    /// <summary>
    /// Cập nhật permissions cho role với format đơn giản hơn (dành cho admin)
    /// </summary>
    public async Task UpdateRolePermissionsAsync(int roleId, UpdateRolePermissionsDto dto)
    {
        // Xóa tất cả permissions cũ của role trong một lần (hiệu quả hơn)
        await _repo.DeleteAllByRoleIdAsync(roleId);

        // Tạo danh sách permissions mới để thêm hàng loạt
        var permissionsToAdd = new List<RolePermission>();
        
        foreach (var featurePerm in dto.FeaturePermissions)
        {
            foreach (var permissionTypeId in featurePerm.PermissionTypeIds)
            {
                permissionsToAdd.Add(new RolePermission
                {
                    RoleId = roleId,
                    FeatureId = featurePerm.FeatureId,
                    PermissionTypeId = permissionTypeId,
                    IsAllowed = true
                });
            }
        }

        // Thêm tất cả permissions mới trong một lần
        if (permissionsToAdd.Count > 0)
        {
            await _repo.AddRangeAsync(permissionsToAdd);
        }
    }
}
