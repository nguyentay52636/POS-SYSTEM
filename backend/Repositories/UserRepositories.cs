using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Repositories;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<User> Items, int Total)> SearchAsync(UserQueryParams query);
    Task<IReadOnlyList<User>> ListAllAsync();
}

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _db;

    public UserRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<User> CreateAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public Task<User?> GetByIdAsync(int id)
    {
        return _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);
    }

    public Task<User?> GetByUsernameAsync(string username)
    {
        return _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User> UpdateAsync(User user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Users.FindAsync(id);
        if (existing == null) return false;
        _db.Users.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<User> Items, int Total)> SearchAsync(UserQueryParams query)
    {
        IQueryable<User> q = _db.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Username))
        {
            q = q.Where(u => u.Username != null && u.Username.Contains(query.Username));
        }

        if (!string.IsNullOrWhiteSpace(query.Role))
        {
            q = q.Where(u => u.Role == query.Role);
        }

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword;
            q = q.Where(u =>
                (u.Username != null && u.Username.Contains(keyword)) ||
                (u.FullName != null && u.FullName.Contains(keyword))
            );
        }

        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        switch ((query.SortBy ?? string.Empty).ToLowerInvariant())
        {
            case "username":
                q = desc ? q.OrderByDescending(u => u.Username) : q.OrderBy(u => u.Username);
                break;
            case "fullname":
                q = desc ? q.OrderByDescending(u => u.FullName) : q.OrderBy(u => u.FullName);
                break;
            default:
                q = desc ? q.OrderByDescending(u => u.CreatedAt) : q.OrderBy(u => u.CreatedAt);
                break;
        }

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<User>> ListAllAsync()
    {
        IQueryable<User> q = _db.Users.AsNoTracking();
        q = q.OrderByDescending(u => u.CreatedAt);
        var items = await q.ToListAsync();
        return items;
    }
}


