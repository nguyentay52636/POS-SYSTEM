using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface ICustomerRepository
{
    Task<Customer> CreateAsync(Customer customer);
    Task<Customer?> GetByIdAsync(int id);
    Task<Customer?> GetByNameAsync(string name);
    Task<Customer?> GetByEmailAsync(string email);
    Task<Customer> UpdateAsync(Customer customer);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Customer> Items, int Total)> SearchAsync(CustomerQueryParams query);
    Task<IReadOnlyList<Customer>> ListAllAsync();
}

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _db;

    public CustomerRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Customer> CreateAsync(Customer customer)
    {
        customer.CreatedAt = DateTime.UtcNow;
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        return customer;
    }

    public Task<Customer?> GetByIdAsync(int id)
    {
        return _db.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId == id && !c.IsDeleted);
    }

    public Task<Customer?> GetByNameAsync(string name)
    {
        return _db.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Name == name && !c.IsDeleted);
    }

    public Task<Customer?> GetByEmailAsync(string email)
    {
        return _db.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Email == email && !c.IsDeleted);
    }

    public async Task<Customer> UpdateAsync(Customer customer)
    {
        _db.Customers.Update(customer);
        await _db.SaveChangesAsync();
        return customer;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Customers.FindAsync(id);
        if (existing == null) return false;

        // Soft delete: mark as deleted instead of removing
        _db.Customers.Attach(existing);
        existing.IsDeleted = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Customer> Items, int Total)> SearchAsync(CustomerQueryParams query)
    {
        IQueryable<Customer> q = _db.Customers.AsNoTracking().Where(c => !c.IsDeleted);

        // Apply filters using extension methods
        q = q.WhereIf(!query.Name.IsNullOrWhiteSpace(),
                c => c.Name != null && c.Name.Contains(query.Name!))
            .WhereIf(!query.Email.IsNullOrWhiteSpace(),
                c => c.Email == query.Email)
            .WhereIf(!query.Phone.IsNullOrWhiteSpace(),
                c => c.Phone != null && c.Phone.Contains(query.Phone!))
            .WhereIf(!query.Keyword.IsNullOrWhiteSpace(),
                c => (c.Name != null && c.Name.Contains(query.Keyword!)) ||
                     (c.Email != null && c.Email.Contains(query.Keyword!)) ||
                     (c.Address != null && c.Address.Contains(query.Keyword!)) ||
                     (c.Phone != null && c.Phone.Contains(query.Keyword!)));

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "email" => q.OrderByIf(true, c => c.Email!, desc),
            "createdat" => q.OrderByIf(true, c => c.CreatedAt ?? DateTime.MinValue, desc),
            _ => q.OrderByIf(true, c => c.Name!, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Customer>> ListAllAsync()
    {
        IQueryable<Customer> q = _db.Customers.AsNoTracking().Where(c => !c.IsDeleted);
        q = q.OrderBy(c => c.Name);
        var items = await q.ToListAsync();
        return items;
    }
}
