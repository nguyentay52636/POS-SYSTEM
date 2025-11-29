using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IPermissionTypeRepository
{
    Task<IReadOnlyList<PermissionType>> ListAllAsync();
    Task<PermissionType?> GetByIdAsync(int id);
}

public class PermissionTypeRepository : IPermissionTypeRepository
{
    private readonly ApplicationDbContext _db;

    public PermissionTypeRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<PermissionType>> ListAllAsync()
    {
        return await _db.PermissionTypes.AsNoTracking().ToListAsync();
    }

    public Task<PermissionType?> GetByIdAsync(int id)
    {
        return _db.PermissionTypes.AsNoTracking().FirstOrDefaultAsync(p => p.PermissionTypeId == id);
    }
}
