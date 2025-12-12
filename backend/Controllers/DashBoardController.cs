using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

/// <summary>
/// Dashboard and statistics endpoints for POS system
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Dashboard")]
public class DashBoardController : ControllerBase
{
    private readonly IDashBoardService _service;

    public DashBoardController(IDashBoardService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get complete dashboard statistics
    /// </summary>
    /// <remarks>
    /// Returns comprehensive dashboard data including:
    /// - Overview statistics (revenue, orders, customers, products sold)
    /// - Revenue chart data based on period type
    /// - Top selling products
    /// - Revenue by category
    /// - Order status statistics
    /// 
    /// **Period Types:**
    /// - `week`: Weekly statistics for a specific month
    /// - `month`: Monthly statistics for a specific year (default)
    /// - `quarter`: Quarterly statistics for a specific year
    /// - `year`: Yearly statistics for multiple years
    /// 
    /// **Examples:**
    /// - `/api/dashboard?period=month&amp;year=2024` - Monthly stats for 2024
    /// - `/api/dashboard?period=week&amp;year=2024&amp;month=12` - Weekly stats for Dec 2024
    /// - `/api/dashboard?period=quarter&amp;year=2024` - Quarterly stats for 2024
    /// - `/api/dashboard?period=year` - Yearly stats for last 5 years
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Complete dashboard data</returns>
    [HttpGet]
    [SwaggerOperation(
        Summary = "Get complete dashboard statistics",
        Description = "Returns comprehensive dashboard data with overview, charts, top products, and category revenue"
    )]
    [ProducesResponseType(typeof(DashBoardResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashBoardResponseDto>> GetDashBoard([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetDashBoardAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get overview statistics only
    /// </summary>
    /// <remarks>
    /// Returns quick summary statistics:
    /// - Total revenue
    /// - Total orders
    /// - Total customers
    /// - Total products sold
    /// - Average order value
    /// - Growth rates compared to previous period
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Overview statistics</returns>
    [HttpGet("overview")]
    [SwaggerOperation(
        Summary = "Get overview statistics",
        Description = "Returns quick summary with revenue, orders, customers, and growth rates"
    )]
    [ProducesResponseType(typeof(DashBoardOverviewDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashBoardOverviewDto>> GetOverview([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetOverviewAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get revenue chart data
    /// </summary>
    /// <remarks>
    /// Returns revenue data points for chart visualization:
    /// - `week`: Returns weekly data for specified month
    /// - `month`: Returns monthly data for specified year (12 months)
    /// - `quarter`: Returns quarterly data for specified year (4 quarters)
    /// - `year`: Returns yearly data for last 5 years
    /// 
    /// Each data point includes:
    /// - Label (e.g., "T1", "Tuần 1", "Q1", "2024")
    /// - Revenue amount
    /// - Order count
    /// - Customer count
    /// - Start and end dates
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Revenue chart data points</returns>
    [HttpGet("revenue-chart")]
    [SwaggerOperation(
        Summary = "Get revenue chart data",
        Description = "Returns revenue data points for chart visualization based on period type"
    )]
    [ProducesResponseType(typeof(List<RevenueDataPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RevenueDataPointDto>>> GetRevenueChart([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetRevenueChartAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get monthly revenue statistics
    /// </summary>
    /// <remarks>
    /// Shortcut endpoint for monthly revenue chart.
    /// Returns 12 months of data for the specified year.
    /// </remarks>
    /// <param name="year">Year for statistics (default: current year)</param>
    /// <returns>Monthly revenue data</returns>
    [HttpGet("revenue/monthly")]
    [SwaggerOperation(
        Summary = "Get monthly revenue statistics",
        Description = "Returns 12 months of revenue data for the specified year"
    )]
    [ProducesResponseType(typeof(List<RevenueDataPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RevenueDataPointDto>>> GetMonthlyRevenue([FromQuery] int? year)
    {
        var query = new DashBoardQueryParams
        {
            Period = "month",
            Year = year ?? DateTime.Now.Year
        };
        var result = await _service.GetRevenueChartAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get weekly revenue statistics
    /// </summary>
    /// <remarks>
    /// Returns weekly revenue data for a specific month.
    /// Weeks are calculated from the 1st of the month.
    /// </remarks>
    /// <param name="year">Year (default: current year)</param>
    /// <param name="month">Month 1-12 (default: current month)</param>
    /// <returns>Weekly revenue data</returns>
    [HttpGet("revenue/weekly")]
    [SwaggerOperation(
        Summary = "Get weekly revenue statistics",
        Description = "Returns weekly revenue data for a specific month"
    )]
    [ProducesResponseType(typeof(List<RevenueDataPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RevenueDataPointDto>>> GetWeeklyRevenue(
        [FromQuery] int? year,
        [FromQuery] int? month)
    {
        var query = new DashBoardQueryParams
        {
            Period = "week",
            Year = year ?? DateTime.Now.Year,
            Month = month ?? DateTime.Now.Month
        };
        var result = await _service.GetRevenueChartAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get quarterly revenue statistics
    /// </summary>
    /// <remarks>
    /// Returns 4 quarters of revenue data for the specified year.
    /// Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
    /// </remarks>
    /// <param name="year">Year for statistics (default: current year)</param>
    /// <returns>Quarterly revenue data</returns>
    [HttpGet("revenue/quarterly")]
    [SwaggerOperation(
        Summary = "Get quarterly revenue statistics",
        Description = "Returns 4 quarters of revenue data for the specified year"
    )]
    [ProducesResponseType(typeof(List<RevenueDataPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RevenueDataPointDto>>> GetQuarterlyRevenue([FromQuery] int? year)
    {
        var query = new DashBoardQueryParams
        {
            Period = "quarter",
            Year = year ?? DateTime.Now.Year
        };
        var result = await _service.GetRevenueChartAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get yearly revenue statistics
    /// </summary>
    /// <remarks>
    /// Returns yearly revenue data for the last 5 years.
    /// </remarks>
    /// <returns>Yearly revenue data</returns>
    [HttpGet("revenue/yearly")]
    [SwaggerOperation(
        Summary = "Get yearly revenue statistics",
        Description = "Returns yearly revenue data for the last 5 years"
    )]
    [ProducesResponseType(typeof(List<RevenueDataPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RevenueDataPointDto>>> GetYearlyRevenue()
    {
        var query = new DashBoardQueryParams
        {
            Period = "year",
            Year = DateTime.Now.Year
        };
        var result = await _service.GetRevenueChartAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get top selling products
    /// </summary>
    /// <remarks>
    /// Returns the top selling products for the specified period.
    /// Includes:
    /// - Product details (name, barcode, category, image)
    /// - Total quantity sold
    /// - Total revenue
    /// - Growth rate compared to previous period
    /// - Rank position
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Top selling products</returns>
    [HttpGet("top-products")]
    [SwaggerOperation(
        Summary = "Get top selling products",
        Description = "Returns top selling products with sales data and growth rates"
    )]
    [ProducesResponseType(typeof(List<TopProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TopProductDto>>> GetTopProducts([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetTopProductsAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get revenue by category
    /// </summary>
    /// <remarks>
    /// Returns revenue breakdown by product category.
    /// Includes:
    /// - Category details
    /// - Total revenue per category
    /// - Total quantity sold
    /// - Order count
    /// - Revenue percentage
    /// - Suggested chart color
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Category revenue breakdown</returns>
    [HttpGet("category-revenue")]
    [SwaggerOperation(
        Summary = "Get revenue by category",
        Description = "Returns revenue breakdown by product category with percentages"
    )]
    [ProducesResponseType(typeof(List<CategoryRevenueDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CategoryRevenueDto>>> GetCategoryRevenue([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetCategoryRevenueAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get order status statistics
    /// </summary>
    /// <remarks>
    /// Returns order count and amount grouped by status:
    /// - pending (Chờ xử lý)
    /// - paid (Đã thanh toán)
    /// - canceled (Đã hủy)
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Order status statistics</returns>
    [HttpGet("order-status")]
    [SwaggerOperation(
        Summary = "Get order status statistics",
        Description = "Returns order count and amount grouped by status"
    )]
    [ProducesResponseType(typeof(List<OrderStatusStatDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<OrderStatusStatDto>>> GetOrderStatusStats([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetOrderStatusStatsAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get revenue trend comparison
    /// </summary>
    /// <remarks>
    /// Compares current period with previous period:
    /// - Current vs previous period revenue
    /// - Current vs previous period orders
    /// - Growth rates
    /// </remarks>
    /// <param name="query">Query parameters for filtering</param>
    /// <returns>Revenue trend comparison</returns>
    [HttpGet("trend")]
    [SwaggerOperation(
        Summary = "Get revenue trend comparison",
        Description = "Compares current period with previous period for revenue and orders"
    )]
    [ProducesResponseType(typeof(RevenueTrendDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<RevenueTrendDto>> GetRevenueTrend([FromQuery] DashBoardQueryParams query)
    {
        var result = await _service.GetRevenueTrendAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get daily revenue for a date range
    /// </summary>
    /// <remarks>
    /// Returns daily revenue data for a custom date range.
    /// Useful for detailed analysis of specific periods.
    /// </remarks>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <returns>Daily revenue data</returns>
    [HttpGet("daily")]
    [SwaggerOperation(
        Summary = "Get daily revenue",
        Description = "Returns daily revenue data for a custom date range"
    )]
    [ProducesResponseType(typeof(List<DailyRevenueDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<DailyRevenueDto>>> GetDailyRevenue(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate)
    {
        var startDate = fromDate ?? DateTime.Now.AddDays(-30);
        var endDate = toDate ?? DateTime.Now;

        if (startDate > endDate)
        {
            return BadRequest(new { message = "fromDate must be before toDate" });
        }

        var result = await _service.GetDailyRevenueAsync(startDate, endDate);
        return Ok(result);
    }

    /// <summary>
    /// Get hourly revenue statistics
    /// </summary>
    /// <remarks>
    /// Returns revenue data grouped by hour of day (0-23).
    /// Useful for identifying peak business hours.
    /// </remarks>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <returns>Hourly revenue data</returns>
    [HttpGet("hourly")]
    [SwaggerOperation(
        Summary = "Get hourly revenue statistics",
        Description = "Returns revenue data grouped by hour of day to identify peak hours"
    )]
    [ProducesResponseType(typeof(List<HourlyRevenueDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<HourlyRevenueDto>>> GetHourlyRevenue(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate)
    {
        var startDate = fromDate ?? DateTime.Now.Date;
        var endDate = toDate ?? DateTime.Now;

        if (startDate > endDate)
        {
            return BadRequest(new { message = "fromDate must be before toDate" });
        }

        var result = await _service.GetHourlyRevenueAsync(startDate, endDate);
        return Ok(result);
    }
}
