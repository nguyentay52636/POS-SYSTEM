




using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;


public interface ISupplierRepository
{
    Task<Supplier> CreateAsync(Supplier supplier);
    Task<Supplier?> GetByIdAsync(int id);
    Task<Supplier?> GetByNameAsync(string name);
    Task<Supplier?> GetByEmailAsync(string email);
    Task<Supplier> UpdateAsync(Supplier supplier);
    Task<bool> DeleteAsync(int id);



    Task<(IReadOnlyList<Supplier> Items, int Total)> SearchAsync(SupplierQueryParams query);
    Task<IReadOnlyList<Supplier>> ListAllAsync();
}

public class SupplierRepository : ISupplierRepository
{
    private readonly ApplicationDbContext _db;

    public SupplierRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Supplier> CreateAsync(Supplier supplier)
    {
        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync();
        return supplier;
    }

    public Task<Supplier?> GetByIdAsync(int id)
    {
        return _db.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.SupplierId == id);
    }

    public Task<Supplier?> GetByNameAsync(string name)
    {
        return _db.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.Name == name);
    }

    public Task<Supplier?> GetByEmailAsync(string email)
    {
        return _db.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.Email == email);
    }

    public async Task<Supplier> UpdateAsync(Supplier supplier)
    {
        _db.Suppliers.Update(supplier);
        await _db.SaveChangesAsync();
        return supplier;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Suppliers.FindAsync(id);
        if (existing == null) return false;
        _db.Suppliers.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Supplier> Items, int Total)> SearchAsync(SupplierQueryParams query)
    {
        IQueryable<Supplier> q = _db.Suppliers.AsNoTracking();

        // Apply filters using extension methods
        q = q.WhereIf(!query.Name.IsNullOrWhiteSpace(),
                s => s.Name != null && s.Name.Contains(query.Name!))
            .WhereIf(!query.Email.IsNullOrWhiteSpace(),
                s => s.Email == query.Email)
            .WhereIf(!query.Keyword.IsNullOrWhiteSpace(),
                s => (s.Name != null && s.Name.Contains(query.Keyword!)) ||
                     (s.Email != null && s.Email.Contains(query.Keyword!)) ||
                     (s.Address != null && s.Address.Contains(query.Keyword!)) ||
                     (s.Phone != null && s.Phone.Contains(query.Keyword!)));

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "email" => q.OrderByIf(true, s => s.Email!, desc),
            _ => q.OrderByIf(true, s => s.Name!, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Supplier>> ListAllAsync()
    {
        IQueryable<Supplier> q = _db.Suppliers.AsNoTracking();
        q = q.OrderBy(s => s.Name);
        var items = await q.ToListAsync();
        return items;
    }
}
