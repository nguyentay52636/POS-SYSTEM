using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IExportReceiptRepository
{
    Task<ExportReceipt> CreateAsync(ExportReceipt exportReceipt);
    Task<ExportReceipt?> GetByIdAsync(int id);
    Task<ExportReceipt> UpdateAsync(ExportReceipt exportReceipt);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<ExportReceipt> Items, int Total)> SearchAsync(ExportReceiptQueryParams query);
    Task<IReadOnlyList<ExportReceipt>> ListAllAsync();

    // ExportItem methods
    Task<ExportItem> AddExportItemAsync(ExportItem exportItem);
    Task<IReadOnlyList<ExportItem>> GetExportItemsByExportIdAsync(int exportId);
    Task<IReadOnlyList<ExportItem>> AddExportItemsAsync(List<ExportItem> exportItems);

    // ExportReceipt status methods
    Task<bool> UpdateExportReceiptStatusAsync(int exportId, string status);
    Task<bool> CancelExportReceiptAsync(int exportId);
}

public class ExportReceiptRepository : IExportReceiptRepository
{
    private readonly ApplicationDbContext _db;

    public ExportReceiptRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ExportReceipt> CreateAsync(ExportReceipt exportReceipt)
    {
        exportReceipt.ExportDate = DateTime.Now;
        _db.ExportReceipts.Add(exportReceipt);
        await _db.SaveChangesAsync();
        return exportReceipt;
    }

    public async Task<ExportReceipt?> GetByIdAsync(int id)
    {
        return await _db.ExportReceipts
            .AsNoTracking()
            .Include(e => e.Customer)
            .Include(e => e.User)
            .Include(e => e.ExportItems)
                .ThenInclude(ei => ei.Product)
            .FirstOrDefaultAsync(e => e.ExportId == id);
    }

    public async Task<ExportReceipt> UpdateAsync(ExportReceipt exportReceipt)
    {
        _db.ExportReceipts.Update(exportReceipt);
        await _db.SaveChangesAsync();
        return exportReceipt;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.ExportReceipts.FindAsync(id);
        if (existing == null) return false;
        _db.ExportReceipts.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<ExportReceipt> Items, int Total)> SearchAsync(ExportReceiptQueryParams query)
    {
        IQueryable<ExportReceipt> q = _db.ExportReceipts
            .AsNoTracking()
            .Include(e => e.Customer)
            .Include(e => e.User);

        // Apply filters
        q = q.WhereIf(query.CustomerId.HasValue, e => e.CustomerId == query.CustomerId)
            .WhereIf(query.UserId.HasValue, e => e.UserId == query.UserId)
            .WhereIf(!query.Status.IsNullOrWhiteSpace(), e => e.Status == query.Status)
            .WhereIf(query.FromDate.HasValue, e => e.ExportDate >= query.FromDate)
            .WhereIf(query.ToDate.HasValue, e => e.ExportDate <= query.ToDate);

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "total_amount" => q.OrderByIf(true, e => e.TotalAmount ?? 0, desc),
            "status" => q.OrderByIf(true, e => e.Status!, desc),
            _ => q.OrderByIf(true, e => e.ExportDate ?? DateTime.MinValue, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<ExportReceipt>> ListAllAsync()
    {
        return await _db.ExportReceipts
            .AsNoTracking()
            .Include(e => e.Customer)
            .Include(e => e.User)
            .OrderByDescending(e => e.ExportDate)
            .ToListAsync();
    }

    // ExportItem methods
    public async Task<ExportItem> AddExportItemAsync(ExportItem exportItem)
    {
        _db.ExportItems.Add(exportItem);
        await _db.SaveChangesAsync();
        return exportItem;
    }

    public async Task<IReadOnlyList<ExportItem>> GetExportItemsByExportIdAsync(int exportId)
    {
        return await _db.ExportItems
            .AsNoTracking()
            .Include(ei => ei.Product)
            .Where(ei => ei.ExportId == exportId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<ExportItem>> AddExportItemsAsync(List<ExportItem> exportItems)
    {
        _db.ExportItems.AddRange(exportItems);
        await _db.SaveChangesAsync();
        return exportItems;
    }

    // ExportReceipt status methods
    public async Task<bool> UpdateExportReceiptStatusAsync(int exportId, string status)
    {
        var exportReceipt = await _db.ExportReceipts.FindAsync(exportId);
        if (exportReceipt == null) return false;

        exportReceipt.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelExportReceiptAsync(int exportId)
    {
        var exportReceipt = await _db.ExportReceipts.FindAsync(exportId);
        if (exportReceipt == null) return false;

        // Only allow canceling pending export receipts
        if (exportReceipt.Status != "pending")
        {
            return false;
        }

        exportReceipt.Status = "canceled";
        await _db.SaveChangesAsync();
        return true;
    }
}

