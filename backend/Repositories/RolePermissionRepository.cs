using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IRolePermissionRepository
{
    Task<IReadOnlyList<RolePermission>> GetByRoleIdAsync(int roleId);
    Task<IReadOnlyList<RolePermission>> GetAllAsync();
    Task<RolePermission?> GetAsync(int roleId, int featureId, int permissionTypeId);
    Task<RolePermission?> GetByIdAsync(int roleId, int featureId, int permissionTypeId);
    Task AddAsync(RolePermission rolePermission);
    Task UpdateAsync(RolePermission rolePermission);
    Task<bool> DeleteAsync(int roleId, int featureId, int permissionTypeId);
    Task<int> DeleteAllByRoleIdAsync(int roleId);
    Task AddRangeAsync(IEnumerable<RolePermission> rolePermissions);
    Task UpdateRangeAsync(IEnumerable<RolePermission> rolePermissions);
}

public class RolePermissionRepository : IRolePermissionRepository
{
    private readonly ApplicationDbContext _db;

    public RolePermissionRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<RolePermission>> GetByRoleIdAsync(int roleId)
    {
        return await _db.RolePermissions
            .AsNoTracking()
            .Include(rp => rp.Feature)
            .Include(rp => rp.PermissionType)
            .Where(rp => rp.RoleId == roleId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<RolePermission>> GetAllAsync()
    {
        return await _db.RolePermissions
            .AsNoTracking()
            .Include(rp => rp.Feature)
            .Include(rp => rp.PermissionType)
            .Include(rp => rp.Role)
            .ToListAsync();
    }

    public Task<RolePermission?> GetAsync(int roleId, int featureId, int permissionTypeId)
    {
        return _db.RolePermissions
            .AsNoTracking()
            .Include(rp => rp.Feature)
            .Include(rp => rp.PermissionType)
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId 
                                    && rp.FeatureId == featureId 
                                    && rp.PermissionTypeId == permissionTypeId);
    }

    public Task<RolePermission?> GetByIdAsync(int roleId, int featureId, int permissionTypeId)
    {
        return _db.RolePermissions
            .AsNoTracking()
            .Include(rp => rp.Feature)
            .Include(rp => rp.PermissionType)
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId 
                                    && rp.FeatureId == featureId 
                                    && rp.PermissionTypeId == permissionTypeId);
    }

    public async Task AddAsync(RolePermission rolePermission)
    {
        _db.RolePermissions.Add(rolePermission);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(RolePermission rolePermission)
    {
        // RolePermission has composite key, so we need to find and update manually
        var existing = await _db.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == rolePermission.RoleId 
                                    && rp.FeatureId == rolePermission.FeatureId 
                                    && rp.PermissionTypeId == rolePermission.PermissionTypeId);
        
        if (existing != null)
        {
            existing.IsAllowed = rolePermission.IsAllowed;
            await _db.SaveChangesAsync();
        }
    }

    public async Task AddRangeAsync(IEnumerable<RolePermission> rolePermissions)
    {
        _db.RolePermissions.AddRange(rolePermissions);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateRangeAsync(IEnumerable<RolePermission> rolePermissions)
    {
        // RolePermission has composite key, so we need to find and update manually
        foreach (var rolePermission in rolePermissions)
        {
            var existing = await _db.RolePermissions
                .FirstOrDefaultAsync(rp => rp.RoleId == rolePermission.RoleId 
                                        && rp.FeatureId == rolePermission.FeatureId 
                                        && rp.PermissionTypeId == rolePermission.PermissionTypeId);
            
            if (existing != null)
            {
                existing.IsAllowed = rolePermission.IsAllowed;
            }
        }
        await _db.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int roleId, int featureId, int permissionTypeId)
    {
        var existing = await _db.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId 
                                    && rp.FeatureId == featureId 
                                    && rp.PermissionTypeId == permissionTypeId);
        if (existing == null) return false;
        
        _db.RolePermissions.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Xóa tất cả permissions của một role trong một lần (hiệu quả hơn)
    /// </summary>
    public async Task<int> DeleteAllByRoleIdAsync(int roleId)
    {
        var permissionsToDelete = await _db.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .ToListAsync();
        
        if (permissionsToDelete.Count == 0) return 0;
        
        _db.RolePermissions.RemoveRange(permissionsToDelete);
        await _db.SaveChangesAsync();
        return permissionsToDelete.Count;
    }
}
