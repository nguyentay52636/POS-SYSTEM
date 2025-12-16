using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<Order?> GetByIdAsync(int id);
    Task<Order> UpdateAsync(Order order);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Order> Items, int Total)> SearchAsync(OrderQueryParams query);
    Task<IReadOnlyList<Order>> ListAllAsync();

    // OrderItem methods
    Task<OrderItem> AddOrderItemAsync(OrderItem orderItem);
    Task<IReadOnlyList<OrderItem>> GetOrderItemsByOrderIdAsync(int orderId);
    Task<IReadOnlyList<OrderItem>> AddOrderItemsAsync(List<OrderItem> orderItems);

    // Payment methods
    Task<IReadOnlyList<Payment>> GetPaymentsByOrderIdAsync(int orderId);

    // Order status methods
    Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    Task<bool> CancelOrderAsync(int orderId);
}

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _db;

    public OrderRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Order> CreateAsync(Order order)
    {
        order.OrderDate = DateTime.Now;
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _db.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Supplier)
            .Include(o => o.Customer)
            .Include(o => o.User)
            .Include(o => o.Promo)
            .FirstOrDefaultAsync(o => o.OrderId == id);
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        // Check if entity is already being tracked
        var trackedEntity = _db.Orders.Local.FirstOrDefault(o => o.OrderId == order.OrderId);
        
        if (trackedEntity != null)
        {
            // Update the tracked entity instead
            _db.Entry(trackedEntity).CurrentValues.SetValues(order);
        }
        else
        {
            // Update if not tracked
            _db.Orders.Update(order);
        }
        
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Orders.FindAsync(id);
        if (existing == null) return false;
        _db.Orders.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Order> Items, int Total)> SearchAsync(OrderQueryParams query)
    {
        IQueryable<Order> q = _db.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Supplier)
            .Include(o => o.Customer)
            .Include(o => o.User)
            .Include(o => o.Promo);

        // Apply filters
        q = q.WhereIf(query.CustomerId.HasValue, o => o.CustomerId == query.CustomerId)
            .WhereIf(query.UserId.HasValue, o => o.UserId == query.UserId)
            .WhereIf(!query.Status.IsNullOrWhiteSpace(), o => o.Status == query.Status)
            .WhereIf(query.FromDate.HasValue, o => o.OrderDate >= query.FromDate)
            .WhereIf(query.ToDate.HasValue, o => o.OrderDate <= query.ToDate);

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "total_amount" => q.OrderByIf(true, o => o.TotalAmount ?? 0, desc),
            "status" => q.OrderByIf(true, o => o.Status!, desc),
            _ => q.OrderByIf(true, o => o.OrderDate ?? DateTime.MinValue, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Order>> ListAllAsync()
    {
        return await _db.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Supplier)
            .Include(o => o.Customer)
            .Include(o => o.User)
            .Include(o => o.Promo)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    // OrderItem methods
    public async Task<OrderItem> AddOrderItemAsync(OrderItem orderItem)
    {
        _db.OrderItems.Add(orderItem);
        await _db.SaveChangesAsync();
        return orderItem;
    }

    public async Task<IReadOnlyList<OrderItem>> GetOrderItemsByOrderIdAsync(int orderId)
    {
        return await _db.OrderItems
            .AsNoTracking()
            .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
            .Include(oi => oi.Product)
                .ThenInclude(p => p.Supplier)
            .Where(oi => oi.OrderId == orderId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<OrderItem>> AddOrderItemsAsync(List<OrderItem> orderItems)
    {
        _db.OrderItems.AddRange(orderItems);
        await _db.SaveChangesAsync();
        return orderItems;
    }

    // Payment methods
    public async Task<IReadOnlyList<Payment>> GetPaymentsByOrderIdAsync(int orderId)
    {
        return await _db.Payments
            .AsNoTracking()
            .Where(p => p.OrderId == orderId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    // Order status methods
    public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order == null) return false;

        order.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelOrderAsync(int orderId)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order == null) return false;

        // Only allow canceling pending orders
        if (order.Status != "pending")
        {
            return false;
        }

        order.Status = "canceled";
        await _db.SaveChangesAsync();
        return true;
    }
}
