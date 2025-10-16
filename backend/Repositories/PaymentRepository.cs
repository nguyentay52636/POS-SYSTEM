using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IPaymentRepository
{
    Task<Payment> CreateAsync(Payment payment);
    Task<Payment?> GetByIdAsync(int id);
    Task<Payment> UpdateAsync(Payment payment);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Payment> Items, int Total)> SearchAsync(PaymentQueryParams query);
    Task<IReadOnlyList<Payment>> ListAllAsync();
    Task<IReadOnlyList<Payment>> GetPaymentsByOrderIdAsync(int orderId);
    Task<decimal> GetTotalPaymentsByOrderIdAsync(int orderId);
}

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _db;

    public PaymentRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        payment.PaymentDate = DateTime.Now;
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return payment;
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await _db.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.PaymentId == id);
    }

    public async Task<Payment> UpdateAsync(Payment payment)
    {
        _db.Payments.Update(payment);
        await _db.SaveChangesAsync();
        return payment;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Payments.FindAsync(id);
        if (existing == null) return false;
        _db.Payments.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Payment> Items, int Total)> SearchAsync(PaymentQueryParams query)
    {
        IQueryable<Payment> q = _db.Payments.AsNoTracking();

        // Apply filters
        q = q.WhereIf(query.OrderId.HasValue, p => p.OrderId == query.OrderId)
            .WhereIf(!query.PaymentMethod.IsNullOrWhiteSpace(), p => p.PaymentMethod == query.PaymentMethod)
            .WhereIf(query.FromDate.HasValue, p => p.PaymentDate >= query.FromDate)
            .WhereIf(query.ToDate.HasValue, p => p.PaymentDate <= query.ToDate)
            .WhereIf(query.MinAmount.HasValue, p => p.Amount >= query.MinAmount)
            .WhereIf(query.MaxAmount.HasValue, p => p.Amount <= query.MaxAmount);

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "amount" => q.OrderByIf(true, p => p.Amount, desc),
            _ => q.OrderByIf(true, p => p.PaymentDate ?? DateTime.MinValue, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Payment>> ListAllAsync()
    {
        return await _db.Payments
            .AsNoTracking()
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Payment>> GetPaymentsByOrderIdAsync(int orderId)
    {
        return await _db.Payments
            .AsNoTracking()
            .Where(p => p.OrderId == orderId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalPaymentsByOrderIdAsync(int orderId)
    {
        return await _db.Payments
            .Where(p => p.OrderId == orderId)
            .SumAsync(p => p.Amount);
    }
}
