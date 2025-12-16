using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Services;

public interface ICustomerPointsHistoryService
{
    Task<IReadOnlyList<CustomerPointsHistoryDTO>> GetByCustomerIdAsync(int customerId);
    Task<IReadOnlyList<CustomerPointsHistoryDTO>> GetByOrderIdAsync(int orderId);
    Task<CustomerPointsHistoryDTO> CreateHistoryAsync(int customerId, int? orderId, int pointsEarned, int pointsUsed, string transactionType, string? description = null);
}

public class CustomerPointsHistoryService : ICustomerPointsHistoryService
{
    private readonly ApplicationDbContext _db;

    public CustomerPointsHistoryService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<CustomerPointsHistoryDTO>> GetByCustomerIdAsync(int customerId)
    {
        var histories = await _db.CustomerPointsHistories
            .AsNoTracking()
            .Where(h => h.CustomerId == customerId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return histories.Select(h => new CustomerPointsHistoryDTO
        {
            HistoryId = h.HistoryId,
            CustomerId = h.CustomerId,
            OrderId = h.OrderId,
            PointsEarned = h.PointsEarned,
            PointsUsed = h.PointsUsed,
            PointsBalance = h.PointsBalance,
            TransactionType = h.TransactionType,
            Description = h.Description,
            CreatedAt = h.CreatedAt
        }).ToList();
    }

    public async Task<IReadOnlyList<CustomerPointsHistoryDTO>> GetByOrderIdAsync(int orderId)
    {
        var histories = await _db.CustomerPointsHistories
            .AsNoTracking()
            .Where(h => h.OrderId == orderId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return histories.Select(h => new CustomerPointsHistoryDTO
        {
            HistoryId = h.HistoryId,
            CustomerId = h.CustomerId,
            OrderId = h.OrderId,
            PointsEarned = h.PointsEarned,
            PointsUsed = h.PointsUsed,
            PointsBalance = h.PointsBalance,
            TransactionType = h.TransactionType,
            Description = h.Description,
            CreatedAt = h.CreatedAt
        }).ToList();
    }

    public async Task<CustomerPointsHistoryDTO> CreateHistoryAsync(int customerId, int? orderId, int pointsEarned, int pointsUsed, string transactionType, string? description = null)
    {
        // Get current customer points balance
        var customer = await _db.Customers.FindAsync(customerId);
        if (customer == null)
            throw new KeyNotFoundException($"Customer with ID {customerId} not found");

        int currentBalance = (int)(customer.CustomerPoint ?? 0);
        int newBalance = currentBalance + pointsEarned - pointsUsed;

        var history = new CustomerPointsHistory
        {
            CustomerId = customerId,
            OrderId = orderId,
            PointsEarned = pointsEarned,
            PointsUsed = pointsUsed,
            PointsBalance = newBalance,
            TransactionType = transactionType,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        _db.CustomerPointsHistories.Add(history);
        
        // Update customer points
        customer.CustomerPoint = newBalance;
        
        await _db.SaveChangesAsync();

        return new CustomerPointsHistoryDTO
        {
            HistoryId = history.HistoryId,
            CustomerId = history.CustomerId,
            OrderId = history.OrderId,
            PointsEarned = history.PointsEarned,
            PointsUsed = history.PointsUsed,
            PointsBalance = history.PointsBalance,
            TransactionType = history.TransactionType,
            Description = history.Description,
            CreatedAt = history.CreatedAt
        };
    }
}
