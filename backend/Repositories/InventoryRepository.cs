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
    Task<Inventory> CreateAsync(Inventory inventory);
    Task DeleteAsync(int inventoryId);
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
            .Include(i => i.Product)
                .ThenInclude(p => p.Category)
            .Include(i => i.Product)
                .ThenInclude(p => p.Supplier)
            .OrderBy(i => i.ProductId)
            .ToListAsync();
    }

    public async Task<Inventory?> GetByProductIdAsync(int productId)
    {
        return await _db.Inventories
            .AsNoTracking()
            .Include(i => i.Product)
                .ThenInclude(p => p.Category)
            .Include(i => i.Product)
                .ThenInclude(p => p.Supplier)
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
    // ---------- BẠN DÁN CODE NÀY VÀO TRONG CLASS InventoryRepository ----------

    /// <summary>
    /// Thêm một bản ghi Inventory mới vào DB
    /// </summary>
    public async Task<Inventory> CreateAsync(Inventory inventory)
    {
        // Đặt thời gian cập nhật
        inventory.UpdatedAt = DateTime.UtcNow;

        // Thêm vào DbSet
        await _db.Inventories.AddAsync(inventory);
        
        // Lưu thay đổi
        await _db.SaveChangesAsync();
        
        // Trả về đối tượng đã được tạo (bây giờ đã có InventoryId)
        return inventory;
    }

    /// <summary>
    /// Xóa một bản ghi Inventory khỏi DB bằng Primary Key (InventoryId)
    /// </summary>
    public async Task DeleteAsync(int inventoryId)
    {
        // Tạo một đối tượng Inventory "giả" (stub) chỉ với ID.
        // Đây là cách hiệu quả để xóa mà không cần SELECT trước.
        var inventoryToDelete = new Inventory { InventoryId = inventoryId };

        // Đính kèm nó vào DbContext và đánh dấu là đã xóa
        _db.Inventories.Remove(inventoryToDelete);

        // Lưu thay đổi để thực thi lệnh DELETE
        await _db.SaveChangesAsync();
    }
    
    // -----------------------------------------------------------------------
}
