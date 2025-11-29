using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IRolePermissionRepository
{
    Task<IReadOnlyList<RolePermission>> GetByRoleIdAsync(int roleId);
    Task<RolePermission?> GetAsync(int roleId, int featureId, int permissionTypeId);
    Task AddAsync(RolePermission rolePermission);
    Task UpdateAsync(RolePermission rolePermission);
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

    public Task<RolePermission?> GetAsync(int roleId, int featureId, int permissionTypeId)
    {
        return _db.RolePermissions
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
        _db.RolePermissions.Update(rolePermission);
        await _db.SaveChangesAsync();
    }

    public async Task AddRangeAsync(IEnumerable<RolePermission> rolePermissions)
    {
        _db.RolePermissions.AddRange(rolePermissions);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateRangeAsync(IEnumerable<RolePermission> rolePermissions)
    {
        _db.RolePermissions.UpdateRange(rolePermissions);
        await _db.SaveChangesAsync();
    }
}
