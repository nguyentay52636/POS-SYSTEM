using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Services;

public class OrderCancellationHistoryDTO
{
    public int CancellationId { get; set; }
    public int OrderId { get; set; }
    public string? CancellationReason { get; set; }
    public int CanceledByEmployeeId { get; set; }
    public string? CanceledByEmployeeName { get; set; }
    public DateTime? CancellationDate { get; set; }
}

public interface IOrderCancellationHistoryService
{
    Task<IReadOnlyList<OrderCancellationHistoryDTO>> GetByOrderIdAsync(int orderId);
    Task<OrderCancellationHistoryDTO> CreateCancellationAsync(int orderId, string? reason, int canceledByEmployeeId);
}

public class OrderCancellationHistoryService : IOrderCancellationHistoryService
{
    private readonly ApplicationDbContext _db;

    public OrderCancellationHistoryService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<OrderCancellationHistoryDTO>> GetByOrderIdAsync(int orderId)
    {
        var histories = await _db.OrderCancellationHistories
            .AsNoTracking()
            .Include(h => h.CanceledByEmployee)
            .Where(h => h.OrderId == orderId)
            .OrderByDescending(h => h.CancellationDate)
            .ToListAsync();

        return histories.Select(h => new OrderCancellationHistoryDTO
        {
            CancellationId = h.CancellationId,
            OrderId = h.OrderId,
            CancellationReason = h.CancellationReason,
            CanceledByEmployeeId = h.CanceledByEmployeeId,
            CanceledByEmployeeName = h.CanceledByEmployee?.FullName,
            CancellationDate = h.CancellationDate
        }).ToList();
    }

    public async Task<OrderCancellationHistoryDTO> CreateCancellationAsync(int orderId, string? reason, int canceledByEmployeeId)
    {
        var history = new OrderCancellationHistory
        {
            OrderId = orderId,
            CancellationReason = reason,
            CanceledByEmployeeId = canceledByEmployeeId,
            CancellationDate = DateTime.UtcNow
        };

        _db.OrderCancellationHistories.Add(history);
        await _db.SaveChangesAsync();

        // Load employee for DTO
        await _db.Entry(history).Reference(h => h.CanceledByEmployee).LoadAsync();

        return new OrderCancellationHistoryDTO
        {
            CancellationId = history.CancellationId,
            OrderId = history.OrderId,
            CancellationReason = history.CancellationReason,
            CanceledByEmployeeId = history.CanceledByEmployeeId,
            CanceledByEmployeeName = history.CanceledByEmployee?.FullName,
            CancellationDate = history.CancellationDate
        };
    }
}
