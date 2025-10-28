using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
    Task<Product?> GetByIdAsync(int id);
    Task<Product?> GetByBarcodeAsync(string barcode);
    Task<Product> UpdateAsync(Product product);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Product> Items, int Total)> SearchAsync(ProductQueryParams query);
    Task<IReadOnlyList<Product>> ListAllAsync();
    Task<bool> ExistsAsync(int id);
    Task<bool> CategoryExistsAsync(int categoryId);
    Task<bool> SupplierExistsAsync(int supplierId);
}

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _db;

    public ProductRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return product;
    }

    public Task<Product?> GetByIdAsync(int id)
    {
        return _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == id);
    }

    public Task<Product?> GetByBarcodeAsync(string barcode)
    {
        return _db.Products.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Barcode == barcode);
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        _db.Products.Update(product);
        await _db.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Products.FindAsync(id);
        if (existing == null) return false;
        _db.Products.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Product> Items, int Total)> SearchAsync(ProductQueryParams query)
    {
        IQueryable<Product> q = _db.Products.AsNoTracking();

        // Apply filters
        q = q.WhereIf(!query.ProductName.IsNullOrWhiteSpace(),
                p => p.ProductName != null && p.ProductName.Contains(query.ProductName!))
            .WhereIf(!query.Barcode.IsNullOrWhiteSpace(),
                p => p.Barcode != null && p.Barcode.Contains(query.Barcode!))
            .WhereIf(!query.Keyword.IsNullOrWhiteSpace(),
                p => (p.ProductName != null && p.ProductName.Contains(query.Keyword!)) ||
                     (p.Barcode != null && p.Barcode.Contains(query.Keyword!)))
            .WhereIf(query.CategoryId.HasValue,
                p => p.CategoryId == query.CategoryId)
            .WhereIf(query.SupplierId.HasValue,
                p => p.SupplierId == query.SupplierId)
            .WhereIf(query.MinPrice.HasValue,
                p => p.Price >= query.MinPrice)
            .WhereIf(query.MaxPrice.HasValue,
                p => p.Price <= query.MaxPrice);

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "id" => q.OrderByIf(true, p => p.ProductId, desc),
            "price" => q.OrderByIf(true, p => p.Price ?? 0, desc),
            "created" => q.OrderByIf(true, p => p.CreatedAt ?? DateTime.MinValue, desc),
            _ => q.OrderByIf(true, p => p.ProductName!, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Product>> ListAllAsync()
    {
        return await _db.Products
            .AsNoTracking()
            .OrderBy(p => p.ProductName)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _db.Products.AnyAsync(p => p.ProductId == id);
    }

    public async Task<bool> CategoryExistsAsync(int categoryId)
    {
        return await _db.Categories.AnyAsync(c => c.CategoryId == categoryId);
    }

    public async Task<bool> SupplierExistsAsync(int supplierId)
    {
        return await _db.Suppliers.AnyAsync(s => s.SupplierId == supplierId);
    }
}
