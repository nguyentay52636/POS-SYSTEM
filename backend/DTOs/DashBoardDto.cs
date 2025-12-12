using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

#region Query Parameters

/// <summary>
/// Parameters for dashboard statistics query
/// </summary>
public class DashBoardQueryParams
{
    /// <summary>
    /// Period type: week, month, quarter, year
    /// </summary>
    [RegularExpression("^(week|month|quarter|year)$", ErrorMessage = "Period must be 'week', 'month', 'quarter', or 'year'")]
    public string Period { get; set; } = "month";

    /// <summary>
    /// Start date for custom range
    /// </summary>
    public DateTime? FromDate { get; set; }

    /// <summary>
    /// End date for custom range
    /// </summary>
    public DateTime? ToDate { get; set; }

    /// <summary>
    /// Year for statistics (default: current year)
    /// </summary>
    public int? Year { get; set; }

    /// <summary>
    /// Month for weekly statistics (1-12)
    /// </summary>
    [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
    public int? Month { get; set; }

    /// <summary>
    /// Quarter for quarterly statistics (1-4)
    /// </summary>
    [Range(1, 4, ErrorMessage = "Quarter must be between 1 and 4")]
    public int? Quarter { get; set; }

    /// <summary>
    /// Number of top products to return
    /// </summary>
    [Range(1, 50, ErrorMessage = "TopCount must be between 1 and 50")]
    public int TopCount { get; set; } = 10;
}

#endregion

#region Response DTOs

/// <summary>
/// Overview statistics for dashboard
/// </summary>
public class DashBoardOverviewDto
{
    /// <summary>
    /// Total revenue in the period
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Total number of orders
    /// </summary>
    public int TotalOrders { get; set; }

    /// <summary>
    /// Total number of customers
    /// </summary>
    public int TotalCustomers { get; set; }

    /// <summary>
    /// Total number of products sold
    /// </summary>
    public int TotalProductsSold { get; set; }

    /// <summary>
    /// Average order value
    /// </summary>
    public decimal AverageOrderValue { get; set; }

    /// <summary>
    /// Revenue growth rate compared to previous period (%)
    /// </summary>
    public decimal RevenueGrowthRate { get; set; }

    /// <summary>
    /// Order growth rate compared to previous period (%)
    /// </summary>
    public decimal OrderGrowthRate { get; set; }

    /// <summary>
    /// Customer growth rate compared to previous period (%)
    /// </summary>
    public decimal CustomerGrowthRate { get; set; }
}

/// <summary>
/// Revenue data point for charts
/// </summary>
public class RevenueDataPointDto
{
    /// <summary>
    /// Label for the data point (e.g., "T1", "Tuần 1", "Q1")
    /// </summary>
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Period value (month number, week number, quarter number)
    /// </summary>
    public int PeriodValue { get; set; }

    /// <summary>
    /// Total revenue for this period
    /// </summary>
    public decimal Revenue { get; set; }

    /// <summary>
    /// Number of orders in this period
    /// </summary>
    public int OrderCount { get; set; }

    /// <summary>
    /// Number of customers in this period
    /// </summary>
    public int CustomerCount { get; set; }

    /// <summary>
    /// Start date of the period
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// End date of the period
    /// </summary>
    public DateTime EndDate { get; set; }
}

/// <summary>
/// Top selling product data
/// </summary>
public class TopProductDto
{
    /// <summary>
    /// Product ID
    /// </summary>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    public string ProductName { get; set; } = string.Empty;

    /// <summary>
    /// Product barcode
    /// </summary>
    public string? Barcode { get; set; }

    /// <summary>
    /// Category name
    /// </summary>
    public string? CategoryName { get; set; }

    /// <summary>
    /// Product image URL
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Total quantity sold
    /// </summary>
    public int TotalQuantitySold { get; set; }

    /// <summary>
    /// Total revenue from this product
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Growth rate compared to previous period (%)
    /// </summary>
    public decimal GrowthRate { get; set; }

    /// <summary>
    /// Rank position
    /// </summary>
    public int Rank { get; set; }
}

/// <summary>
/// Revenue by category data
/// </summary>
public class CategoryRevenueDto
{
    /// <summary>
    /// Category ID
    /// </summary>
    public int CategoryId { get; set; }

    /// <summary>
    /// Category name
    /// </summary>
    public string CategoryName { get; set; } = string.Empty;

    /// <summary>
    /// Total revenue from this category
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Total quantity sold in this category
    /// </summary>
    public int TotalQuantitySold { get; set; }

    /// <summary>
    /// Number of orders containing products from this category
    /// </summary>
    public int OrderCount { get; set; }

    /// <summary>
    /// Percentage of total revenue
    /// </summary>
    public decimal RevenuePercentage { get; set; }

    /// <summary>
    /// Color for chart display (hex color)
    /// </summary>
    public string Color { get; set; } = string.Empty;
}

/// <summary>
/// Order status statistics
/// </summary>
public class OrderStatusStatDto
{
    /// <summary>
    /// Order status (pending, paid, canceled)
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Status display name in Vietnamese
    /// </summary>
    public string StatusDisplay { get; set; } = string.Empty;

    /// <summary>
    /// Count of orders with this status
    /// </summary>
    public int Count { get; set; }

    /// <summary>
    /// Percentage of total orders
    /// </summary>
    public decimal Percentage { get; set; }

    /// <summary>
    /// Total amount of orders with this status
    /// </summary>
    public decimal TotalAmount { get; set; }
}

/// <summary>
/// Complete dashboard response
/// </summary>
public class DashBoardResponseDto
{
    /// <summary>
    /// Query period information
    /// </summary>
    public PeriodInfoDto PeriodInfo { get; set; } = new();

    /// <summary>
    /// Overview statistics
    /// </summary>
    public DashBoardOverviewDto Overview { get; set; } = new();

    /// <summary>
    /// Revenue chart data
    /// </summary>
    public List<RevenueDataPointDto> RevenueChart { get; set; } = new();

    /// <summary>
    /// Top selling products
    /// </summary>
    public List<TopProductDto> TopProducts { get; set; } = new();

    /// <summary>
    /// Revenue by category
    /// </summary>
    public List<CategoryRevenueDto> CategoryRevenue { get; set; } = new();

    /// <summary>
    /// Order status statistics
    /// </summary>
    public List<OrderStatusStatDto> OrderStatusStats { get; set; } = new();
}

/// <summary>
/// Period information for the query
/// </summary>
public class PeriodInfoDto
{
    /// <summary>
    /// Period type (week, month, quarter, year)
    /// </summary>
    public string PeriodType { get; set; } = string.Empty;

    /// <summary>
    /// Display name for the period
    /// </summary>
    public string PeriodDisplay { get; set; } = string.Empty;

    /// <summary>
    /// Start date of the period
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// End date of the period
    /// </summary>
    public DateTime EndDate { get; set; }

    /// <summary>
    /// Year
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Month (if applicable)
    /// </summary>
    public int? Month { get; set; }

    /// <summary>
    /// Quarter (if applicable)
    /// </summary>
    public int? Quarter { get; set; }
}

/// <summary>
/// Revenue trend comparison between periods
/// </summary>
public class RevenueTrendDto
{
    /// <summary>
    /// Current period revenue
    /// </summary>
    public decimal CurrentPeriodRevenue { get; set; }

    /// <summary>
    /// Previous period revenue
    /// </summary>
    public decimal PreviousPeriodRevenue { get; set; }

    /// <summary>
    /// Growth rate (%)
    /// </summary>
    public decimal GrowthRate { get; set; }

    /// <summary>
    /// Current period orders
    /// </summary>
    public int CurrentPeriodOrders { get; set; }

    /// <summary>
    /// Previous period orders
    /// </summary>
    public int PreviousPeriodOrders { get; set; }

    /// <summary>
    /// Order growth rate (%)
    /// </summary>
    public decimal OrderGrowthRate { get; set; }
}

/// <summary>
/// Daily revenue statistics
/// </summary>
public class DailyRevenueDto
{
    /// <summary>
    /// Date
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// Day of week in Vietnamese
    /// </summary>
    public string DayOfWeek { get; set; } = string.Empty;

    /// <summary>
    /// Total revenue
    /// </summary>
    public decimal Revenue { get; set; }

    /// <summary>
    /// Number of orders
    /// </summary>
    public int OrderCount { get; set; }
}

/// <summary>
/// Hourly revenue statistics
/// </summary>
public class HourlyRevenueDto
{
    /// <summary>
    /// Hour of day (0-23)
    /// </summary>
    public int Hour { get; set; }

    /// <summary>
    /// Hour label (e.g., "08:00", "14:00")
    /// </summary>
    public string HourLabel { get; set; } = string.Empty;

    /// <summary>
    /// Total revenue in this hour
    /// </summary>
    public decimal Revenue { get; set; }

    /// <summary>
    /// Number of orders in this hour
    /// </summary>
    public int OrderCount { get; set; }
}

#endregion

