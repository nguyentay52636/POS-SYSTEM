using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories
{
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

        // 🔹 Lấy toàn bộ tồn kho kèm tên sản phẩm (ProductName)
        public async Task<IReadOnlyList<Inventory>> ListAllAsync()
        {
            var query = from inv in _db.Inventories
                        join p in _db.Products on inv.ProductId equals p.ProductId
                        orderby inv.ProductId
                        select new Inventory
                        {
                            InventoryId = inv.InventoryId,
                            ProductId = inv.ProductId,
                            Quantity = inv.Quantity,
                            UpdatedAt = inv.UpdatedAt,

                            // Tạo object Product ảo chỉ để chứa ProductName
                            Product = new Product
                            {
                                ProductId = p.ProductId,
                                ProductName = p.ProductName
                            }
                        };

            return await query.AsNoTracking().ToListAsync();
        }

        // 🔹 Lấy 1 bản ghi tồn kho theo ProductId (kèm ProductName)
        public async Task<Inventory?> GetByProductIdAsync(int productId)
        {
            var query = from inv in _db.Inventories
                        join p in _db.Products on inv.ProductId equals p.ProductId
                        where inv.ProductId == productId
                        select new Inventory
                        {
                            InventoryId = inv.InventoryId,
                            ProductId = inv.ProductId,
                            Quantity = inv.Quantity,
                            UpdatedAt = inv.UpdatedAt,
                            Product = new Product
                            {
                                ProductId = p.ProductId,
                                ProductName = p.ProductName
                            }
                        };

            return await query.AsNoTracking().FirstOrDefaultAsync();
        }

        // 🔹 Cập nhật số lượng tồn
        public async Task<Inventory> UpdateAsync(Inventory inventory)
        {
            inventory.UpdatedAt = DateTime.UtcNow;
            _db.Inventories.Update(inventory);
            await _db.SaveChangesAsync();
            return inventory;
        }

        // 🔹 Kiểm tra sản phẩm có tồn tại không
        public async Task<bool> ProductExistsAsync(int productId)
        {
            return await _db.Products.AnyAsync(p => p.ProductId == productId);
        }

        // 🔹 Tạo bản ghi tồn kho mới
        public async Task<Inventory> CreateAsync(Inventory inventory)
        {
            inventory.UpdatedAt = DateTime.UtcNow;
            await _db.Inventories.AddAsync(inventory);
            await _db.SaveChangesAsync();
            return inventory;
        }

        // 🔹 Xóa bản ghi tồn kho
        public async Task DeleteAsync(int inventoryId)
        {
            var inventoryToDelete = new Inventory { InventoryId = inventoryId };
            _db.Inventories.Remove(inventoryToDelete);
            await _db.SaveChangesAsync();
        }
    }
}
