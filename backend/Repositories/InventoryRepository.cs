using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IInventoryRepository
{
    Task<IReadOnlyList<Inventory>> ListAllAsync();
    Task<Inventory?> GetByProductIdAsync(int productId);
    Task<Inventory> UpdateAsync(Inventory inventory);
    Task<bool> ProductExistsAsync(int productId);
}

public class InventoryRepository : IInventoryRepository
{
    private readonly ApplicationDbContext _db;

    public InventoryRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Inventory>> ListAllAsync()
    {
        return await _db.Inventories
            .AsNoTracking()
            .OrderBy(i => i.ProductId)
            .ToListAsync();
    }

    public Task<Inventory?> GetByProductIdAsync(int productId)
    {
        return _db.Inventories
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.ProductId == productId);
    }

    public async Task<Inventory> UpdateAsync(Inventory inventory)
    {
        inventory.UpdatedAt = DateTime.UtcNow;
        _db.Inventories.Update(inventory);
        await _db.SaveChangesAsync();
        return inventory;
    }

    public async Task<bool> ProductExistsAsync(int productId)
    {
        return await _db.Products.AnyAsync(p => p.ProductId == productId);
    }
}
