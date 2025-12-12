using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Repositories;

namespace backend.Services;

public interface IDashBoardService
{
    /// <summary>
    /// Get complete dashboard statistics
    /// </summary>
    Task<DashBoardResponseDto> GetDashBoardAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get overview statistics only
    /// </summary>
    Task<DashBoardOverviewDto> GetOverviewAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get revenue chart data based on period type
    /// </summary>
    Task<List<RevenueDataPointDto>> GetRevenueChartAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get top selling products
    /// </summary>
    Task<List<TopProductDto>> GetTopProductsAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get revenue by category
    /// </summary>
    Task<List<CategoryRevenueDto>> GetCategoryRevenueAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get order status statistics
    /// </summary>
    Task<List<OrderStatusStatDto>> GetOrderStatusStatsAsync(DashBoardQueryParams query);

    /// <summary>
    /// Get daily revenue for a specific range
    /// </summary>
    Task<List<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get hourly revenue statistics
    /// </summary>
    Task<List<HourlyRevenueDto>> GetHourlyRevenueAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Get revenue trend comparison
    /// </summary>
    Task<RevenueTrendDto> GetRevenueTrendAsync(DashBoardQueryParams query);
}

public class DashBoardService : IDashBoardService
{
    private readonly IDashBoardRepository _dashBoardRepo;

    public DashBoardService(IDashBoardRepository dashBoardRepo)
    {
        _dashBoardRepo = dashBoardRepo;
    }

    public async Task<DashBoardResponseDto> GetDashBoardAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        var periodInfo = GetPeriodInfo(query, startDate, endDate);

        var response = new DashBoardResponseDto
        {
            PeriodInfo = periodInfo,
            Overview = await GetOverviewAsync(query),
            RevenueChart = await GetRevenueChartAsync(query),
            TopProducts = await GetTopProductsAsync(query),
            CategoryRevenue = await GetCategoryRevenueAsync(query),
            OrderStatusStats = await GetOrderStatusStatsAsync(query)
        };

        return response;
    }

    public async Task<DashBoardOverviewDto> GetOverviewAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        var (previousStart, previousEnd) = GetPreviousPeriodRange(query, startDate, endDate);

        // Current period stats
        var currentRevenue = await _dashBoardRepo.GetTotalRevenueAsync(startDate, endDate);
        var currentOrders = await _dashBoardRepo.GetTotalOrdersAsync(startDate, endDate);
        var currentCustomers = await _dashBoardRepo.GetUniqueCustomersAsync(startDate, endDate);
        var currentProductsSold = await _dashBoardRepo.GetTotalProductsSoldAsync(startDate, endDate);

        // Previous period stats for growth calculation
        var previousRevenue = await _dashBoardRepo.GetTotalRevenueAsync(previousStart, previousEnd);
        var previousOrders = await _dashBoardRepo.GetTotalOrdersAsync(previousStart, previousEnd);
        var previousCustomers = await _dashBoardRepo.GetUniqueCustomersAsync(previousStart, previousEnd);

        return new DashBoardOverviewDto
        {
            TotalRevenue = currentRevenue,
            TotalOrders = currentOrders,
            TotalCustomers = currentCustomers,
            TotalProductsSold = currentProductsSold,
            AverageOrderValue = currentOrders > 0 ? Math.Round(currentRevenue / currentOrders, 2) : 0,
            RevenueGrowthRate = CalculateGrowthRate(currentRevenue, previousRevenue),
            OrderGrowthRate = CalculateGrowthRate(currentOrders, previousOrders),
            CustomerGrowthRate = CalculateGrowthRate(currentCustomers, previousCustomers)
        };
    }

    public async Task<List<RevenueDataPointDto>> GetRevenueChartAsync(DashBoardQueryParams query)
    {
        var year = query.Year ?? DateTime.Now.Year;

        return query.Period.ToLowerInvariant() switch
        {
            "week" => await _dashBoardRepo.GetWeeklyRevenueAsync(year, query.Month ?? DateTime.Now.Month),
            "quarter" => await _dashBoardRepo.GetQuarterlyRevenueAsync(year),
            "year" => await _dashBoardRepo.GetYearlyRevenueAsync(year - 4, year), // Last 5 years
            _ => await _dashBoardRepo.GetMonthlyRevenueAsync(year) // Default: month
        };
    }

    public async Task<List<TopProductDto>> GetTopProductsAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        return await _dashBoardRepo.GetTopProductsAsync(startDate, endDate, query.TopCount);
    }

    public async Task<List<CategoryRevenueDto>> GetCategoryRevenueAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        return await _dashBoardRepo.GetCategoryRevenueAsync(startDate, endDate);
    }

    public async Task<List<OrderStatusStatDto>> GetOrderStatusStatsAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        return await _dashBoardRepo.GetOrderStatusStatsAsync(startDate, endDate);
    }

    public async Task<List<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate)
    {
        return await _dashBoardRepo.GetDailyRevenueAsync(startDate, endDate);
    }

    public async Task<List<HourlyRevenueDto>> GetHourlyRevenueAsync(DateTime startDate, DateTime endDate)
    {
        return await _dashBoardRepo.GetHourlyRevenueAsync(startDate, endDate);
    }

    public async Task<RevenueTrendDto> GetRevenueTrendAsync(DashBoardQueryParams query)
    {
        var (startDate, endDate) = GetDateRange(query);
        var (previousStart, previousEnd) = GetPreviousPeriodRange(query, startDate, endDate);

        var currentRevenue = await _dashBoardRepo.GetTotalRevenueAsync(startDate, endDate);
        var currentOrders = await _dashBoardRepo.GetTotalOrdersAsync(startDate, endDate);
        var previousRevenue = await _dashBoardRepo.GetTotalRevenueAsync(previousStart, previousEnd);
        var previousOrders = await _dashBoardRepo.GetTotalOrdersAsync(previousStart, previousEnd);

        return new RevenueTrendDto
        {
            CurrentPeriodRevenue = currentRevenue,
            PreviousPeriodRevenue = previousRevenue,
            GrowthRate = CalculateGrowthRate(currentRevenue, previousRevenue),
            CurrentPeriodOrders = currentOrders,
            PreviousPeriodOrders = previousOrders,
            OrderGrowthRate = CalculateGrowthRate(currentOrders, previousOrders)
        };
    }

    #region Helper Methods

    private (DateTime startDate, DateTime endDate) GetDateRange(DashBoardQueryParams query)
    {
        // If custom date range is provided
        if (query.FromDate.HasValue && query.ToDate.HasValue)
        {
            return (query.FromDate.Value, query.ToDate.Value);
        }

        var now = DateTime.Now;
        var year = query.Year ?? now.Year;

        return query.Period.ToLowerInvariant() switch
        {
            "week" => GetWeekRange(year, query.Month ?? now.Month),
            "month" => GetMonthRange(year, query.Month ?? now.Month),
            "quarter" => GetQuarterRange(year, query.Quarter ?? ((now.Month - 1) / 3 + 1)),
            "year" => GetYearRange(year),
            _ => GetMonthRange(year, query.Month ?? now.Month)
        };
    }

    private (DateTime startDate, DateTime endDate) GetPreviousPeriodRange(DashBoardQueryParams query, DateTime currentStart, DateTime currentEnd)
    {
        var periodLength = (currentEnd - currentStart).TotalDays + 1;

        return query.Period.ToLowerInvariant() switch
        {
            "week" => (currentStart.AddDays(-7), currentEnd.AddDays(-7)),
            "month" => (currentStart.AddMonths(-1), currentStart.AddDays(-1)),
            "quarter" => (currentStart.AddMonths(-3), currentStart.AddDays(-1)),
            "year" => (currentStart.AddYears(-1), currentEnd.AddYears(-1)),
            _ => (currentStart.AddDays(-periodLength), currentStart.AddDays(-1))
        };
    }

    private (DateTime startDate, DateTime endDate) GetWeekRange(int year, int month)
    {
        // Return the current week of the specified month
        var now = DateTime.Now;
        var startOfWeek = now.AddDays(-(int)now.DayOfWeek + 1); // Monday
        if (startOfWeek.Month != month || startOfWeek.Year != year)
        {
            startOfWeek = new DateTime(year, month, 1);
        }
        var endOfWeek = startOfWeek.AddDays(6);
        var endOfMonth = new DateTime(year, month, DateTime.DaysInMonth(year, month));
        if (endOfWeek > endOfMonth) endOfWeek = endOfMonth;

        return (startOfWeek, endOfWeek);
    }

    private (DateTime startDate, DateTime endDate) GetMonthRange(int year, int month)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddSeconds(-1);
        return (startDate, endDate);
    }

    private (DateTime startDate, DateTime endDate) GetQuarterRange(int year, int quarter)
    {
        var startMonth = (quarter - 1) * 3 + 1;
        var startDate = new DateTime(year, startMonth, 1);
        var endDate = startDate.AddMonths(3).AddSeconds(-1);
        return (startDate, endDate);
    }

    private (DateTime startDate, DateTime endDate) GetYearRange(int year)
    {
        return (new DateTime(year, 1, 1), new DateTime(year, 12, 31, 23, 59, 59));
    }

    private PeriodInfoDto GetPeriodInfo(DashBoardQueryParams query, DateTime startDate, DateTime endDate)
    {
        var now = DateTime.Now;
        var year = query.Year ?? now.Year;
        var month = query.Month ?? now.Month;
        var quarter = query.Quarter ?? ((now.Month - 1) / 3 + 1);

        string periodDisplay = query.Period.ToLowerInvariant() switch
        {
            "week" => $"Tuần hiện tại - Tháng {month}/{year}",
            "month" => $"Tháng {month}/{year}",
            "quarter" => $"Quý {quarter}/{year}",
            "year" => $"Năm {year}",
            _ => $"Tháng {month}/{year}"
        };

        return new PeriodInfoDto
        {
            PeriodType = query.Period,
            PeriodDisplay = periodDisplay,
            StartDate = startDate,
            EndDate = endDate,
            Year = year,
            Month = query.Period.ToLowerInvariant() == "month" || query.Period.ToLowerInvariant() == "week" ? month : null,
            Quarter = query.Period.ToLowerInvariant() == "quarter" ? quarter : null
        };
    }

    private decimal CalculateGrowthRate(decimal current, decimal previous)
    {
        if (previous == 0)
        {
            return current > 0 ? 100 : 0;
        }
        return Math.Round((current - previous) / previous * 100, 2);
    }

    private decimal CalculateGrowthRate(int current, int previous)
    {
        return CalculateGrowthRate((decimal)current, (decimal)previous);
    }

    #endregion
}

