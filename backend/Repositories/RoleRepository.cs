using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IRoleRepository
{
    Task<Role> CreateAsync(Role role);
    Task<Role?> GetByIdAsync(int id);
    Task<Role?> GetByNameAsync(string name);
    Task<Role> UpdateAsync(Role role);
    Task<bool> DeleteAsync(int id);
    Task<IReadOnlyList<Role>> ListAllAsync();
}

public class RoleRepository : IRoleRepository
{
    private readonly ApplicationDbContext _db;

    public RoleRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Role> CreateAsync(Role role)
    {
        _db.Roles.Add(role);
        await _db.SaveChangesAsync();
        return role;
    }

    public Task<Role?> GetByIdAsync(int id)
    {
        return _db.Roles.AsNoTracking().FirstOrDefaultAsync(r => r.RoleId == id);
    }

    // public Task<Role?> GetByNameAsync(string roleName)
    // {
    //     return _db.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
    // }
    public Task<Role?> GetByNameAsync(string roleName)
    {
        throw new NotImplementedException("RoleName column is missing in DB");
    }

    public async Task<Role> UpdateAsync(Role role)
    {
        _db.Roles.Update(role);
        await _db.SaveChangesAsync();
        return role;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Roles.FindAsync(id);
        if (existing == null) return false;
        _db.Roles.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IReadOnlyList<Role>> ListAllAsync()
    {
        return await _db.Roles.AsNoTracking().ToListAsync();
    }
}
