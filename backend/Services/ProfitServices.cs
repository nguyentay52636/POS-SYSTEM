using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Services;

public interface IProfitConfigurationService
{
    Task<ProfitConfigurationDTO?> GetCurrentConfigurationAsync();
    Task<ProfitConfigurationDTO> UpdateConfigurationAsync(UpdateProfitConfigurationDTO dto);
}

public class ProfitConfigurationService : IProfitConfigurationService
{
    private readonly ApplicationDbContext _db;

    public ProfitConfigurationService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ProfitConfigurationDTO?> GetCurrentConfigurationAsync()
    {
        var config = await _db.ProfitConfigurations
            .AsNoTracking()
            .Include(c => c.UpdatedByEmployee)
            .OrderByDescending(c => c.UpdatedAt)
            .FirstOrDefaultAsync();

        if (config == null) return null;

        return new ProfitConfigurationDTO
        {
            ConfigId = config.ConfigId,
            DefaultProfitPercentage = config.DefaultProfitPercentage,
            UpdatedAt = config.UpdatedAt,
            UpdatedByEmployeeId = config.UpdatedByEmployeeId,
            UpdatedByEmployeeName = config.UpdatedByEmployee?.FullName
        };
    }

    public async Task<ProfitConfigurationDTO> UpdateConfigurationAsync(UpdateProfitConfigurationDTO dto)
    {
        // Validate Employee if ID is provided
        if (dto.UpdatedByEmployeeId.HasValue)
        {
            var employeeExists = await _db.Employees.AnyAsync(e => e.EmployeeId == dto.UpdatedByEmployeeId.Value);
            if (!employeeExists)
            {
                // Instead of failing, just unlink the employee for this update since the user ID might be stale
                dto.UpdatedByEmployeeId = null;
            }
        }

        var config = new ProfitConfiguration
        {
            DefaultProfitPercentage = dto.DefaultProfitPercentage,
            UpdatedAt = DateTime.UtcNow,
            UpdatedByEmployeeId = dto.UpdatedByEmployeeId
        };

        _db.ProfitConfigurations.Add(config);
        await _db.SaveChangesAsync();

        // Load employee if exists
        if (dto.UpdatedByEmployeeId.HasValue)
            await _db.Entry(config).Reference(c => c.UpdatedByEmployee).LoadAsync();

        return new ProfitConfigurationDTO
        {
            ConfigId = config.ConfigId,
            DefaultProfitPercentage = config.DefaultProfitPercentage,
            UpdatedAt = config.UpdatedAt,
            UpdatedByEmployeeId = config.UpdatedByEmployeeId,
            UpdatedByEmployeeName = config.UpdatedByEmployee?.FullName
        };
    }
}

public interface IProfitRuleService
{
    Task<IReadOnlyList<ProfitRuleDTO>> GetAllAsync(string? status = null);
    Task<ProfitRuleDTO?> GetByProductIdAsync(int productId);
    Task<ProfitRuleDTO> CreateAsync(CreateProfitRuleDTO dto);
    Task<ProfitRuleDTO> UpdateAsync(int ruleId, UpdateProfitRuleDTO dto);
    Task<bool> DeleteAsync(int ruleId);
}

public class ProfitRuleService : IProfitRuleService
{
    private readonly ApplicationDbContext _db;

    public ProfitRuleService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProfitRuleDTO>> GetAllAsync(string? status = null)
    {
        IQueryable<ProfitRule> query = _db.ProfitRules
            .AsNoTracking()
            .Include(r => r.Product)
            .Include(r => r.Employee);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);
        else
            query = query.Where(r => r.Status == "active");

        var rules = await query.OrderBy(r => r.Priority).ToListAsync();

        return rules.Select(r => new ProfitRuleDTO
        {
            RuleId = r.RuleId,
            RuleType = r.RuleType,
            ProductId = r.ProductId,
            ProductName = r.Product?.ProductName,
            ProfitPercentage = r.ProfitPercentage,
            Priority = r.Priority,
            Status = r.Status,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt,
            EmployeeId = r.EmployeeId,
            EmployeeName = r.Employee?.FullName
        }).ToList();
    }

    public async Task<ProfitRuleDTO?> GetByProductIdAsync(int productId)
    {
        var rule = await _db.ProfitRules
            .AsNoTracking()
            .Include(r => r.Product)
            .Include(r => r.Employee)
            .Where(r => r.ProductId == productId && r.Status == "active")
            .OrderBy(r => r.Priority)
            .FirstOrDefaultAsync();

        if (rule == null) return null;

        return new ProfitRuleDTO
        {
            RuleId = rule.RuleId,
            RuleType = rule.RuleType,
            ProductId = rule.ProductId,
            ProductName = rule.Product?.ProductName,
            ProfitPercentage = rule.ProfitPercentage,
            Priority = rule.Priority,
            Status = rule.Status,
            CreatedAt = rule.CreatedAt,
            UpdatedAt = rule.UpdatedAt,
            EmployeeId = rule.EmployeeId,
            EmployeeName = rule.Employee?.FullName
        };
    }

    public async Task<ProfitRuleDTO> CreateAsync(CreateProfitRuleDTO dto)
    {
        var rule = new ProfitRule
        {
            RuleType = "by_product",
            ProductId = dto.ProductId,
            ProfitPercentage = dto.ProfitPercentage,
            Priority = dto.Priority,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            EmployeeId = dto.EmployeeId
        };

        _db.ProfitRules.Add(rule);
        await _db.SaveChangesAsync();

        await _db.Entry(rule).Reference(r => r.Product).LoadAsync();
        if (dto.EmployeeId.HasValue)
            await _db.Entry(rule).Reference(r => r.Employee).LoadAsync();

        return new ProfitRuleDTO
        {
            RuleId = rule.RuleId,
            RuleType = rule.RuleType,
            ProductId = rule.ProductId,
            ProductName = rule.Product?.ProductName,
            ProfitPercentage = rule.ProfitPercentage,
            Priority = rule.Priority,
            Status = rule.Status,
            CreatedAt = rule.CreatedAt,
            UpdatedAt = rule.UpdatedAt,
            EmployeeId = rule.EmployeeId,
            EmployeeName = rule.Employee?.FullName
        };
    }

    public async Task<ProfitRuleDTO> UpdateAsync(int ruleId, UpdateProfitRuleDTO dto)
    {
        var rule = await _db.ProfitRules
            .Include(r => r.Product)
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.RuleId == ruleId);

        if (rule == null)
            throw new KeyNotFoundException($"Profit rule with ID {ruleId} not found");

        if (dto.ProfitPercentage.HasValue)
            rule.ProfitPercentage = dto.ProfitPercentage.Value;
        if (dto.Priority.HasValue)
            rule.Priority = dto.Priority.Value;
        if (!string.IsNullOrWhiteSpace(dto.Status))
            rule.Status = dto.Status;
        if (dto.EmployeeId.HasValue)
            rule.EmployeeId = dto.EmployeeId;

        rule.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new ProfitRuleDTO
        {
            RuleId = rule.RuleId,
            RuleType = rule.RuleType,
            ProductId = rule.ProductId,
            ProductName = rule.Product?.ProductName,
            ProfitPercentage = rule.ProfitPercentage,
            Priority = rule.Priority,
            Status = rule.Status,
            CreatedAt = rule.CreatedAt,
            UpdatedAt = rule.UpdatedAt,
            EmployeeId = rule.EmployeeId,
            EmployeeName = rule.Employee?.FullName
        };
    }

    public async Task<bool> DeleteAsync(int ruleId)
    {
        var rule = await _db.ProfitRules.FindAsync(ruleId);
        if (rule == null) return false;

        rule.Status = "inactive";
        rule.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}
