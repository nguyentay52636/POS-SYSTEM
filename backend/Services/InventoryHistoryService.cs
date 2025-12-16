using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Services;

public interface IInventoryHistoryService
{
    Task<IReadOnlyList<InventoryHistoryDTO>> GetByProductIdAsync(int productId);
    Task<InventoryHistoryDTO> CreateHistoryAsync(int productId, int oldQuantity, int newQuantity, string changeType, string? reason = null, string? note = null, int? employeeId = null);
}

public class InventoryHistoryService : IInventoryHistoryService
{
    private readonly ApplicationDbContext _db;

    public InventoryHistoryService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<InventoryHistoryDTO>> GetByProductIdAsync(int productId)
    {
        var histories = await _db.InventoryHistories
            .AsNoTracking()
            .Include(h => h.Product)
            .Include(h => h.Employee)
            .Where(h => h.ProductId == productId)
            .OrderByDescending(h => h.ChangeDate)
            .ToListAsync();

        return histories.Select(h => new InventoryHistoryDTO
        {
            HistoryId = h.HistoryId,
            ProductId = h.ProductId,
            ProductName = h.Product?.ProductName,
            OldQuantity = h.OldQuantity,
            NewQuantity = h.NewQuantity,
            Difference = h.Difference,
            ChangeType = h.ChangeType,
            Reason = h.Reason,
            Note = h.Note,
            EmployeeId = h.EmployeeId,
            EmployeeName = h.Employee?.FullName,
            ChangeDate = h.ChangeDate
        }).ToList();
    }

    public async Task<InventoryHistoryDTO> CreateHistoryAsync(int productId, int oldQuantity, int newQuantity, string changeType, string? reason = null, string? note = null, int? employeeId = null)
    {
        var history = new InventoryHistory
        {
            ProductId = productId,
            OldQuantity = oldQuantity,
            NewQuantity = newQuantity,
            Difference = newQuantity - oldQuantity,
            ChangeType = changeType,
            Reason = reason,
            Note = note,
            EmployeeId = employeeId,
            ChangeDate = DateTime.UtcNow
        };

        _db.InventoryHistories.Add(history);
        await _db.SaveChangesAsync();

        // Load related entities for DTO
        await _db.Entry(history).Reference(h => h.Product).LoadAsync();
        if (employeeId.HasValue)
            await _db.Entry(history).Reference(h => h.Employee).LoadAsync();

        return new InventoryHistoryDTO
        {
            HistoryId = history.HistoryId,
            ProductId = history.ProductId,
            ProductName = history.Product?.ProductName,
            OldQuantity = history.OldQuantity,
            NewQuantity = history.NewQuantity,
            Difference = history.Difference,
            ChangeType = history.ChangeType,
            Reason = history.Reason,
            Note = history.Note,
            EmployeeId = history.EmployeeId,
            EmployeeName = history.Employee?.FullName,
            ChangeDate = history.ChangeDate
        };
    }
}
