using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Services;

/// <summary>
/// Service to synchronize status between Product and Inventory
/// </summary>
public interface IProductInventoryStatusSyncService
{
    Task SyncProductToInventoryAsync(int productId, string newProductStatus);
    Task SyncInventoryToProductAsync(int productId, string newInventoryStatus);
}

public class ProductInventoryStatusSyncService : IProductInventoryStatusSyncService
{
    private readonly ApplicationDbContext _db;

    public ProductInventoryStatusSyncService(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// When Product status changes, sync to Inventory (if exists)
    /// Product active → Inventory available
    /// Product inactive → Inventory unavailable
    /// </summary>
    public async Task SyncProductToInventoryAsync(int productId, string newProductStatus)
    {
        var inventory = await _db.Inventories
            .FirstOrDefaultAsync(i => i.ProductId == productId);

        if (inventory != null)
        {
            inventory.Status = newProductStatus == "active" ? "available" : "unavailable";
            inventory.UpdatedAt = System.DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    /// <summary>
    /// When Inventory status changes, sync to Product
    /// Inventory available → Product active
    /// Inventory unavailable → Product inactive
    /// </summary>
    public async Task SyncInventoryToProductAsync(int productId, string newInventoryStatus)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product != null)
        {
            product.Status = newInventoryStatus == "available" ? "active" : "inactive";
            await _db.SaveChangesAsync();
        }
    }
}
