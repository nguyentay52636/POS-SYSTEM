using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IEmployeeRepository
{
    Task<Employee> CreateAsync(Employee employee);
    Task<Employee?> GetByIdAsync(int id);
    Task<Employee> UpdateAsync(Employee employee);
    Task<bool> DeleteAsync(int id);
    Task<IReadOnlyList<Employee>> ListAllAsync(string? status = null);
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly ApplicationDbContext _db;

    public EmployeeRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Employee> CreateAsync(Employee employee)
    {
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return employee;
    }

    public Task<Employee?> GetByIdAsync(int id)
    {
        return _db.Employees
            .Include(e => e.Users)
            .ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(e => e.EmployeeId == id);
    }

    public async Task<Employee> UpdateAsync(Employee employee)
    {
        // If the entity is detached (e.g. created from DTO), attach it.
        // If it is already tracked (e.g. loaded via GetById), we don't need to call Update() 
        // as it would force a graph update and might cause identity resolution conflicts.
        if (_db.Entry(employee).State == EntityState.Detached)
        {
            _db.Employees.Update(employee);
        }
        
        await _db.SaveChangesAsync();
        return employee;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Employees.FindAsync(id);
        if (existing == null) return false;

        // Soft delete: mark as inactive
        _db.Employees.Attach(existing);
        existing.Status = "inactive";
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IReadOnlyList<Employee>> ListAllAsync(string? status = null)
    {
        IQueryable<Employee> query = _db.Employees;
        
        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(e => e.Status == status);
        }

        return await query
            .Include(e => e.Users)
            .ThenInclude(u => u.Role)
            .OrderBy(e => e.FullName)
            .ToListAsync();
    }
}
