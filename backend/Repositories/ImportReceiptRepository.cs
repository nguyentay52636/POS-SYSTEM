using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IImportReceiptRepository
{
    Task<ImportReceipt> CreateAsync(ImportReceipt importReceipt);
    Task<ImportReceipt?> GetByIdAsync(int id);
    Task<ImportReceipt?> GetByIdWithDetailsAsync(int id);
    Task<ImportReceipt> UpdateAsync(ImportReceipt importReceipt);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<ImportReceipt> Items, int Total)> SearchAsync(ImportReceiptQueryParams query);
    Task<IReadOnlyList<ImportReceipt>> ListAllAsync();

    // ImportItem methods
    Task<ImportItem> AddImportItemAsync(ImportItem importItem);
    Task<IReadOnlyList<ImportItem>> AddImportItemsAsync(List<ImportItem> importItems);
    Task<IReadOnlyList<ImportItem>> GetImportItemsByImportIdAsync(int importId);
    Task<bool> DeleteImportItemsByImportIdAsync(int importId);

    // Status methods
    Task<bool> UpdateStatusAsync(int importId, string status);

    // Statistics methods
    Task<ImportStatsResponseDto> GetStatsAsync(DateTime? fromDate, DateTime? toDate);
}

public class ImportReceiptRepository : IImportReceiptRepository
{
    private readonly ApplicationDbContext _db;

    public ImportReceiptRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ImportReceipt> CreateAsync(ImportReceipt importReceipt)
    {
        importReceipt.ImportDate = DateTime.Now;
        importReceipt.TotalAmount = 0;
        importReceipt.Status = importReceipt.Status ?? "pending";
        _db.ImportReceipts.Add(importReceipt);
        await _db.SaveChangesAsync();
        return importReceipt;
    }

    public async Task<ImportReceipt?> GetByIdAsync(int id)
    {
        return await _db.ImportReceipts
            .AsNoTracking()
            .Include(ir => ir.Supplier)
            .Include(ir => ir.User)
            .FirstOrDefaultAsync(ir => ir.ImportId == id);
    }

    public async Task<ImportReceipt?> GetByIdWithDetailsAsync(int id)
    {
        return await _db.ImportReceipts
            .AsNoTracking()
            .Include(ir => ir.Supplier)
            .Include(ir => ir.User)
            .Include(ir => ir.ImportItems)
                .ThenInclude(ii => ii.Product)
            .FirstOrDefaultAsync(ir => ir.ImportId == id);
    }

    public async Task<ImportReceipt> UpdateAsync(ImportReceipt importReceipt)
    {
        _db.ImportReceipts.Update(importReceipt);
        await _db.SaveChangesAsync();
        return importReceipt;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.ImportReceipts
            .Include(ir => ir.ImportItems)
            .FirstOrDefaultAsync(ir => ir.ImportId == id);
        if (existing == null) return false;

        // Delete related import items first
        _db.ImportItems.RemoveRange(existing.ImportItems);
        _db.ImportReceipts.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<ImportReceipt> Items, int Total)> SearchAsync(ImportReceiptQueryParams query)
    {
        IQueryable<ImportReceipt> q = _db.ImportReceipts
            .AsNoTracking()
            .Include(ir => ir.Supplier)
            .Include(ir => ir.User);

        // Apply filters
        q = q.WhereIf(query.SupplierId.HasValue, ir => ir.SupplierId == query.SupplierId)
            .WhereIf(query.UserId.HasValue, ir => ir.UserId == query.UserId)
            .WhereIf(!query.Status.IsNullOrWhiteSpace(), ir => ir.Status == query.Status)
            .WhereIf(query.FromDate.HasValue, ir => ir.ImportDate >= query.FromDate)
            .WhereIf(query.ToDate.HasValue, ir => ir.ImportDate <= query.ToDate);

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "total_amount" => q.OrderByIf(true, ir => ir.TotalAmount ?? 0, desc),
            "status" => q.OrderByIf(true, ir => ir.Status!, desc),
            _ => q.OrderByIf(true, ir => ir.ImportDate ?? DateTime.MinValue, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<ImportReceipt>> ListAllAsync()
    {
        return await _db.ImportReceipts
            .AsNoTracking()
            .Include(ir => ir.Supplier)
            .Include(ir => ir.User)
            .OrderByDescending(ir => ir.ImportDate)
            .ToListAsync();
    }

    public async Task<ImportItem> AddImportItemAsync(ImportItem importItem)
    {
        importItem.Subtotal = importItem.UnitPrice * importItem.Quantity;
        _db.ImportItems.Add(importItem);
        await _db.SaveChangesAsync();

        // Update total amount
        await UpdateTotalAmountAsync(importItem.ImportId);

        return importItem;
    }

    public async Task<IReadOnlyList<ImportItem>> AddImportItemsAsync(List<ImportItem> importItems)
    {
        foreach (var item in importItems)
        {
            item.Subtotal = item.UnitPrice * item.Quantity;
        }

        _db.ImportItems.AddRange(importItems);
        await _db.SaveChangesAsync();

        // Update total amount for all affected imports
        var importIds = importItems.Select(ii => ii.ImportId).Distinct().ToList();
        foreach (var importId in importIds)
        {
            await UpdateTotalAmountAsync(importId);
        }

        return importItems;
    }

    public async Task<IReadOnlyList<ImportItem>> GetImportItemsByImportIdAsync(int importId)
    {
        return await _db.ImportItems
            .AsNoTracking()
            .Include(ii => ii.Product)
            .Where(ii => ii.ImportId == importId)
            .ToListAsync();
    }

    public async Task<bool> DeleteImportItemsByImportIdAsync(int importId)
    {
        var items = await _db.ImportItems
            .Where(ii => ii.ImportId == importId)
            .ToListAsync();

        if (items.Count == 0) return false;

        _db.ImportItems.RemoveRange(items);
        await _db.SaveChangesAsync();

        // Update total amount
        await UpdateTotalAmountAsync(importId);

        return true;
    }

    public async Task<bool> UpdateStatusAsync(int importId, string status)
    {
        var importReceipt = await _db.ImportReceipts.FindAsync(importId);
        if (importReceipt == null) return false;

        importReceipt.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<ImportStatsResponseDto> GetStatsAsync(DateTime? fromDate, DateTime? toDate)
    {
        IQueryable<ImportReceipt> q = _db.ImportReceipts.AsNoTracking();

        if (fromDate.HasValue)
            q = q.Where(ir => ir.ImportDate >= fromDate);
        if (toDate.HasValue)
            q = q.Where(ir => ir.ImportDate <= toDate);

        var imports = await q.ToListAsync();

        var stats = new ImportStatsResponseDto
        {
            TotalImports = imports.Count,
            TotalAmount = imports.Where(ir => ir.TotalAmount.HasValue).Sum(ir => ir.TotalAmount!.Value),
            PendingImports = imports.Count(ir => ir.Status == "pending"),
            CompletedImports = imports.Count(ir => ir.Status == "completed"),
            CanceledImports = imports.Count(ir => ir.Status == "canceled")
        };

        // Group by supplier
        var supplierStats = imports
            .Where(ir => ir.SupplierId > 0)
            .GroupBy(ir => new { ir.SupplierId, SupplierName = ir.Supplier != null ? ir.Supplier.Name : "Unknown" })
            .Select(g => new ImportStatsBySupplierDto
            {
                SupplierId = g.Key.SupplierId,
                SupplierName = g.Key.SupplierName,
                ImportCount = g.Count(),
                TotalAmount = g.Where(ir => ir.TotalAmount.HasValue).Sum(ir => ir.TotalAmount!.Value)
            })
            .ToList();

        stats.BySupplier = supplierStats;

        return stats;
    }

    private async Task UpdateTotalAmountAsync(int importId)
    {
        var total = await _db.ImportItems
            .Where(ii => ii.ImportId == importId)
            .SumAsync(ii => ii.Subtotal);

        var importReceipt = await _db.ImportReceipts.FindAsync(importId);
        if (importReceipt != null)
        {
            importReceipt.TotalAmount = total;
            await _db.SaveChangesAsync();
        }
    }
}

