using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Extensions;

namespace backend.Repositories;

public interface IPromotionRepository
{
    Task<Promotion> CreateAsync(Promotion promotion);
    Task<Promotion?> GetByIdAsync(int id);
    Task<Promotion?> GetByPromoCodeAsync(string promoCode);
    Task<Promotion> UpdateAsync(Promotion promotion);
    Task<bool> DeleteAsync(int id);
    Task<(IReadOnlyList<Promotion> Items, int Total)> SearchAsync(PromotionQueryParams query);
    Task<IReadOnlyList<Promotion>> ListAllAsync();
    Task<IReadOnlyList<Promotion>> GetActivePromotionsAsync();
}

public class PromotionRepository : IPromotionRepository
{
    private readonly ApplicationDbContext _db;

    public PromotionRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Promotion> CreateAsync(Promotion promotion)
    {
        _db.Promotions.Add(promotion);
        await _db.SaveChangesAsync();
        return promotion;
    }

    public Task<Promotion?> GetByIdAsync(int id)
    {
        return _db.Promotions.AsNoTracking().FirstOrDefaultAsync(p => p.PromoId == id);
    }

    public Task<Promotion?> GetByPromoCodeAsync(string promoCode)
    {
        return _db.Promotions.AsNoTracking().FirstOrDefaultAsync(p => p.PromoCode == promoCode);
    }

    public async Task<Promotion> UpdateAsync(Promotion promotion)
    {
        _db.Promotions.Update(promotion);
        await _db.SaveChangesAsync();
        return promotion;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Promotions.FindAsync(id);
        if (existing == null) return false;
        _db.Promotions.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(IReadOnlyList<Promotion> Items, int Total)> SearchAsync(PromotionQueryParams query)
    {
        IQueryable<Promotion> q = _db.Promotions.AsNoTracking();

        // Apply filters using extension methods
        q = q.WhereIf(!query.PromoCode.IsNullOrWhiteSpace(),
                p => p.PromoCode != null && p.PromoCode.Contains(query.PromoCode!))
            .WhereIf(!query.Status.IsNullOrWhiteSpace(),
                p => p.Status == query.Status)
            .WhereIf(!query.DiscountType.IsNullOrWhiteSpace(),
                p => p.DiscountType == query.DiscountType)
            .WhereIf(!query.Keyword.IsNullOrWhiteSpace(),
                p => (p.PromoCode != null && p.PromoCode.Contains(query.Keyword!)) ||
                     (p.Description != null && p.Description.Contains(query.Keyword!)));

        // Apply sorting
        bool desc = string.Equals(query.SortDir, "desc", StringComparison.OrdinalIgnoreCase);
        q = (query.SortBy?.ToLowerInvariant()) switch
        {
            "promo_code" => q.OrderByIf(true, p => p.PromoCode!, desc),
            "end_date" => q.OrderByIf(true, p => p.EndDate!.Value, desc),
            "discount_value" => q.OrderByIf(true, p => p.DiscountValue!.Value, desc),
            _ => q.OrderByIf(true, p => p.StartDate!.Value, desc)
        };

        int total = await q.CountAsync();
        int skip = Math.Max(0, (query.Page - 1) * query.PageSize);
        var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();
        return (items, total);
    }

    public async Task<IReadOnlyList<Promotion>> ListAllAsync()
    {
        IQueryable<Promotion> q = _db.Promotions.AsNoTracking();
        q = q.OrderByDescending(p => p.StartDate);
        var items = await q.ToListAsync();
        return items;
    }

    public async Task<IReadOnlyList<Promotion>> GetActivePromotionsAsync()
    {
        var now = DateTime.Now;
        IQueryable<Promotion> q = _db.Promotions.AsNoTracking()
            .Where(p => p.Status == "active" &&
                       p.StartDate <= now &&
                       p.EndDate >= now &&
                       (p.UsageLimit == 0 || p.UsedCount < p.UsageLimit));

        q = q.OrderBy(p => p.StartDate);
        var items = await q.ToListAsync();
        return items;
    }
}
