using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface ICategoryRepository
{
    Task<Category> CreateAsync(Category category);
    Task<Category?> GetByIdAsync(int id);
    Task<Category?> GetByNameAsync(string name);
    Task<Category> UpdateAsync(Category category);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Category> Items, int Total)> SearchAsync(CategoryQueryParams query);
    Task<IReadOnlyList<Category>> ListAllAsync();
    Task<bool> ExistsAsync(int id);
    Task<int> CountProductsInCategoryAsync(int categoryId);
}

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _db;

    public CategoryRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Category> CreateAsync(Category category)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public Task<Category?> GetByIdAsync(int id)
    {
        return _db.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.CategoryId == id);
    }

    public Task<Category?> GetByNameAsync(string name)
    {
        return _db.Categories.AsNoTracking()
            .FirstOrDefaultAsync(c => c.CategoryName == name);
    }

    public async Task<Category> UpdateAsync(Category category)
    {
        _db.Categories.Update(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Categories.FindAsync(id);
        if (existing == null) return false;
        _db.Categories.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Category> Items, int Total)> SearchAsync(CategoryQueryParams query)
    {
        IQueryable<Category> q = _db.Categories.AsNoTracking();

        // Apply filters
        q = q.WhereIf(!query.CategoryName.IsNullOrWhiteSpace(),
                c => c.CategoryName != null && c.CategoryName.Contains(query.CategoryName!))
            .WhereIf(!query.Keyword.IsNullOrWhiteSpace(),
                c => c.CategoryName != null && c.CategoryName.Contains(query.Keyword!));

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "id" => q.OrderByIf(true, c => c.CategoryId, desc),
            _ => q.OrderByIf(true, c => c.CategoryName!, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Category>> ListAllAsync()
    {
        return await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.CategoryName)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _db.Categories.AnyAsync(c => c.CategoryId == id);
    }

    public async Task<int> CountProductsInCategoryAsync(int categoryId)
    {
        return await _db.Products
            .Where(p => p.CategoryId == categoryId)
            .CountAsync();
    }
}
