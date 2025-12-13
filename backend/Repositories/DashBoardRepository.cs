using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Repositories;

public interface IDashBoardRepository
{
    /// <summary>
    /// Get total revenue for a date range
    /// </summary>
    Task<decimal> GetTotalRevenueAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get total orders count for a date range
    /// </summary>
    Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get unique customers count for a date range
    /// </summary>
    Task<int> GetUniqueCustomersAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get total products sold for a date range
    /// </summary>
    Task<int> GetTotalProductsSoldAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get revenue grouped by month for a year
    /// </summary>
    Task<List<RevenueDataPointDto>> GetMonthlyRevenueAsync(int year);

    /// <summary>
    /// Get revenue grouped by week for a month
    /// </summary>
    Task<List<RevenueDataPointDto>> GetWeeklyRevenueAsync(int year, int month);

    /// <summary>
    /// Get revenue grouped by quarter for a year
    /// </summary>
    Task<List<RevenueDataPointDto>> GetQuarterlyRevenueAsync(int year);

    /// <summary>
    /// Get revenue grouped by year for multiple years
    /// </summary>
    Task<List<RevenueDataPointDto>> GetYearlyRevenueAsync(int startYear, int endYear);

    /// <summary>
    /// Get top selling products for a date range
    /// </summary>
    Task<List<TopProductDto>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int topCount);

    /// <summary>
    /// Get revenue by category (all paid orders)
    /// </summary>
    Task<List<CategoryRevenueDto>> GetCategoryRevenueAsync();

    /// <summary>
    /// Get order status statistics for a date range
    /// </summary>
    Task<List<OrderStatusStatDto>> GetOrderStatusStatsAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get daily revenue for a date range
    /// </summary>
    Task<List<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get hourly revenue statistics for a date range
    /// </summary>
    Task<List<HourlyRevenueDto>> GetHourlyRevenueAsync(DateTime startDate, DateTime endDate);
}

public class DashBoardRepository : IDashBoardRepository
{
    private readonly ApplicationDbContext _db;

    public DashBoardRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime startDate, DateTime endDate)
    {
        return await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == "paid")
            .SumAsync(o => o.TotalAmount ?? 0);
    }

    public async Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate)
    {
        return await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .CountAsync();
    }

    public async Task<int> GetUniqueCustomersAsync(DateTime startDate, DateTime endDate)
    {
        return await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.CustomerId != null)
            .Select(o => o.CustomerId)
            .Distinct()
            .CountAsync();
    }

    public async Task<int> GetTotalProductsSoldAsync(DateTime startDate, DateTime endDate)
    {
        return await _db.OrderItems
            .Include(oi => oi.Order)
            .Where(oi => oi.Order.OrderDate >= startDate && oi.Order.OrderDate <= endDate && oi.Order.Status == "paid")
            .SumAsync(oi => oi.Quantity);
    }

    public async Task<List<RevenueDataPointDto>> GetMonthlyRevenueAsync(int year)
    {
        var startOfYear = new DateTime(year, 1, 1);
        var endOfYear = new DateTime(year, 12, 31, 23, 59, 59);

        var monthlyData = await _db.Orders
            .Where(o => o.OrderDate >= startOfYear && o.OrderDate <= endOfYear && o.Status == "paid")
            .GroupBy(o => o.OrderDate!.Value.Month)
            .Select(g => new
            {
                Month = g.Key,
                Revenue = g.Sum(o => o.TotalAmount ?? 0),
                OrderCount = g.Count(),
                CustomerIds = g.Where(o => o.CustomerId != null).Select(o => o.CustomerId).Distinct().Count()
            })
            .ToListAsync();

        var result = new List<RevenueDataPointDto>();
        for (int month = 1; month <= 12; month++)
        {
            var data = monthlyData.FirstOrDefault(m => m.Month == month);
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            result.Add(new RevenueDataPointDto
            {
                Label = $"T{month}",
                PeriodValue = month,
                Revenue = data?.Revenue ?? 0,
                OrderCount = data?.OrderCount ?? 0,
                CustomerCount = data?.CustomerIds ?? 0,
                StartDate = startDate,
                EndDate = endDate
            });
        }

        return result;
    }

    public async Task<List<RevenueDataPointDto>> GetWeeklyRevenueAsync(int year, int month)
    {
        var startOfMonth = new DateTime(year, month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

        var orders = await _db.Orders
            .Where(o => o.OrderDate >= startOfMonth && o.OrderDate <= endOfMonth && o.Status == "paid")
            .Select(o => new
            {
                o.OrderDate,
                o.TotalAmount,
                o.CustomerId
            })
            .ToListAsync();

        var result = new List<RevenueDataPointDto>();
        var currentWeekStart = startOfMonth;
        int weekNumber = 1;

        while (currentWeekStart <= endOfMonth)
        {
            var weekEnd = currentWeekStart.AddDays(6);
            if (weekEnd > endOfMonth) weekEnd = endOfMonth;

            var weekOrders = orders
                .Where(o => o.OrderDate >= currentWeekStart && o.OrderDate <= weekEnd)
                .ToList();

            result.Add(new RevenueDataPointDto
            {
                Label = $"Tuần {weekNumber}",
                PeriodValue = weekNumber,
                Revenue = weekOrders.Sum(o => o.TotalAmount ?? 0),
                OrderCount = weekOrders.Count,
                CustomerCount = weekOrders.Where(o => o.CustomerId != null).Select(o => o.CustomerId).Distinct().Count(),
                StartDate = currentWeekStart,
                EndDate = weekEnd
            });

            currentWeekStart = weekEnd.AddDays(1);
            weekNumber++;
        }

        return result;
    }

    public async Task<List<RevenueDataPointDto>> GetQuarterlyRevenueAsync(int year)
    {
        var startOfYear = new DateTime(year, 1, 1);
        var endOfYear = new DateTime(year, 12, 31, 23, 59, 59);

        var orders = await _db.Orders
            .Where(o => o.OrderDate >= startOfYear && o.OrderDate <= endOfYear && o.Status == "paid")
            .Select(o => new
            {
                Quarter = (o.OrderDate!.Value.Month - 1) / 3 + 1,
                o.TotalAmount,
                o.CustomerId
            })
            .ToListAsync();

        var result = new List<RevenueDataPointDto>();
        for (int quarter = 1; quarter <= 4; quarter++)
        {
            var quarterOrders = orders.Where(o => o.Quarter == quarter).ToList();
            var startMonth = (quarter - 1) * 3 + 1;
            var startDate = new DateTime(year, startMonth, 1);
            var endDate = startDate.AddMonths(3).AddDays(-1);

            result.Add(new RevenueDataPointDto
            {
                Label = $"Q{quarter}",
                PeriodValue = quarter,
                Revenue = quarterOrders.Sum(o => o.TotalAmount ?? 0),
                OrderCount = quarterOrders.Count,
                CustomerCount = quarterOrders.Where(o => o.CustomerId != null).Select(o => o.CustomerId).Distinct().Count(),
                StartDate = startDate,
                EndDate = endDate
            });
        }

        return result;
    }

    public async Task<List<RevenueDataPointDto>> GetYearlyRevenueAsync(int startYear, int endYear)
    {
        var startDate = new DateTime(startYear, 1, 1);
        var endDate = new DateTime(endYear, 12, 31, 23, 59, 59);

        var yearlyData = await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == "paid")
            .GroupBy(o => o.OrderDate!.Value.Year)
            .Select(g => new
            {
                Year = g.Key,
                Revenue = g.Sum(o => o.TotalAmount ?? 0),
                OrderCount = g.Count(),
                CustomerIds = g.Where(o => o.CustomerId != null).Select(o => o.CustomerId).Distinct().Count()
            })
            .ToListAsync();

        var result = new List<RevenueDataPointDto>();
        for (int year = startYear; year <= endYear; year++)
        {
            var data = yearlyData.FirstOrDefault(y => y.Year == year);
            result.Add(new RevenueDataPointDto
            {
                Label = year.ToString(),
                PeriodValue = year,
                Revenue = data?.Revenue ?? 0,
                OrderCount = data?.OrderCount ?? 0,
                CustomerCount = data?.CustomerIds ?? 0,
                StartDate = new DateTime(year, 1, 1),
                EndDate = new DateTime(year, 12, 31)
            });
        }

        return result;
    }

    public async Task<List<TopProductDto>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int topCount)
    {
        var topProducts = await _db.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
            .Where(oi => oi.Order.OrderDate >= startDate && oi.Order.OrderDate <= endDate && oi.Order.Status == "paid")
            .GroupBy(oi => new
            {
                oi.ProductId,
                oi.Product.ProductName,
                oi.Product.Barcode,
                oi.Product.ImageUrl,
                CategoryName = oi.Product.Category != null ? oi.Product.Category.CategoryName : null
            })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Barcode = g.Key.Barcode,
                CategoryName = g.Key.CategoryName,
                ImageUrl = g.Key.ImageUrl,
                TotalQuantitySold = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.Subtotal)
            })
            .OrderByDescending(p => p.TotalQuantitySold)
            .Take(topCount)
            .ToListAsync();

        // Calculate growth rate by comparing with previous period
        var periodLength = (endDate - startDate).TotalDays;
        var previousStart = startDate.AddDays(-periodLength);
        var previousEnd = startDate.AddSeconds(-1);

        var previousData = await _db.OrderItems
            .Include(oi => oi.Order)
            .Where(oi => oi.Order.OrderDate >= previousStart && oi.Order.OrderDate <= previousEnd && oi.Order.Status == "paid")
            .GroupBy(oi => oi.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                TotalQuantitySold = g.Sum(oi => oi.Quantity)
            })
            .ToListAsync();

        int rank = 1;
        foreach (var product in topProducts)
        {
            product.Rank = rank++;
            var previousProduct = previousData.FirstOrDefault(p => p.ProductId == product.ProductId);
            if (previousProduct != null && previousProduct.TotalQuantitySold > 0)
            {
                product.GrowthRate = Math.Round(((decimal)(product.TotalQuantitySold - previousProduct.TotalQuantitySold) / previousProduct.TotalQuantitySold) * 100, 2);
            }
            else if (product.TotalQuantitySold > 0)
            {
                product.GrowthRate = 100; // New product or no previous sales
            }
        }

        return topProducts;
    }

    public async Task<List<CategoryRevenueDto>> GetCategoryRevenueAsync()
    {
        // Get category revenue from OrderItems (all paid orders, sum of subtotal grouped by category)
        var rawData = await _db.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
            .Where(oi => oi.Order.Status == "paid")
            .GroupBy(oi => new
            {
                CategoryId = oi.Product.CategoryId ?? 0,
                Category = oi.Product.Category != null ? oi.Product.Category.CategoryName : "Khác"
            })
            .Select(g => new
            {
                CategoryId = g.Key.CategoryId,
                Category = g.Key.Category,
                TotalRevenue = g.Sum(oi => oi.Subtotal)  // Sum of orderItems.subtotal in VND
            })
            .OrderByDescending(c => c.TotalRevenue)
            .ToListAsync();

        // Calculate percentages and convert revenue to millions VND
        var totalRevenue = rawData.Sum(c => c.TotalRevenue);
        string[] colors = { "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16" };

        var categoryData = new List<CategoryRevenueDto>();
        for (int i = 0; i < rawData.Count; i++)
        {
            categoryData.Add(new CategoryRevenueDto
            {
                CategoryId = rawData[i].CategoryId,
                Category = rawData[i].Category,
                Revenue = Math.Round(rawData[i].TotalRevenue / 1000000, 0),  // Convert to millions VND (triệu)
                Percentage = totalRevenue > 0
                    ? Math.Round(rawData[i].TotalRevenue / totalRevenue * 100, 0)
                    : 0,
                Color = colors[i % colors.Length]
            });
        }

        return categoryData;
    }

    public async Task<List<OrderStatusStatDto>> GetOrderStatusStatsAsync(DateTime startDate, DateTime endDate)
    {
        var statusStats = await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .GroupBy(o => o.Status)
            .Select(g => new OrderStatusStatDto
            {
                Status = g.Key,
                Count = g.Count(),
                TotalAmount = g.Sum(o => o.TotalAmount ?? 0)
            })
            .ToListAsync();

        var totalOrders = statusStats.Sum(s => s.Count);

        foreach (var stat in statusStats)
        {
            stat.StatusDisplay = stat.Status switch
            {
                "pending" => "Chờ xử lý",
                "paid" => "Đã thanh toán",
                "canceled" => "Đã hủy",
                _ => stat.Status
            };
            stat.Percentage = totalOrders > 0 ? Math.Round((decimal)stat.Count / totalOrders * 100, 2) : 0;
        }

        return statusStats;
    }

    public async Task<List<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate)
    {
        var dailyData = await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == "paid")
            .GroupBy(o => o.OrderDate!.Value.Date)
            .Select(g => new DailyRevenueDto
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.TotalAmount ?? 0),
                OrderCount = g.Count()
            })
            .OrderBy(d => d.Date)
            .ToListAsync();

        string[] dayNames = { "CN", "T2", "T3", "T4", "T5", "T6", "T7" };
        foreach (var day in dailyData)
        {
            day.DayOfWeek = dayNames[(int)day.Date.DayOfWeek];
        }

        return dailyData;
    }

    public async Task<List<HourlyRevenueDto>> GetHourlyRevenueAsync(DateTime startDate, DateTime endDate)
    {
        var hourlyData = await _db.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == "paid")
            .GroupBy(o => o.OrderDate!.Value.Hour)
            .Select(g => new
            {
                Hour = g.Key,
                Revenue = g.Sum(o => o.TotalAmount ?? 0),
                OrderCount = g.Count()
            })
            .ToListAsync();

        var result = new List<HourlyRevenueDto>();
        for (int hour = 0; hour < 24; hour++)
        {
            var data = hourlyData.FirstOrDefault(h => h.Hour == hour);
            result.Add(new HourlyRevenueDto
            {
                Hour = hour,
                HourLabel = $"{hour:D2}:00",
                Revenue = data?.Revenue ?? 0,
                OrderCount = data?.OrderCount ?? 0
            });
        }

        return result;
    }
}

