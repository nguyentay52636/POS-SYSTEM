using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreatePromotionDto
{
    [Required(ErrorMessage = "Promotion code is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Promotion code must be between 3 and 50 characters")]
    public string PromoCode { get; set; } = string.Empty;

    [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Discount type is required")]
    [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be either 'percent' or 'fixed'")]
    public string DiscountType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Discount value is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal DiscountValue { get; set; }

    [Required(ErrorMessage = "Start date is required")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required")]
    public DateTime EndDate { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be 0 or greater")]
    public decimal MinOrderAmount { get; set; } = 0;

    [Range(0, int.MaxValue, ErrorMessage = "Usage limit must be 0 or greater")]
    public int UsageLimit { get; set; } = 0;

    [RegularExpression("^(active|inactive|expired)$", ErrorMessage = "Status must be 'active', 'inactive', or 'expired'")]
    public string Status { get; set; } = "active";
}

public class UpdatePromotionDto
{
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Promotion code must be between 3 and 50 characters")]
    public string? PromoCode { get; set; }

    [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters")]
    public string? Description { get; set; }

    [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be either 'percent' or 'fixed'")]
    public string? DiscountType { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal? DiscountValue { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be 0 or greater")]
    public decimal? MinOrderAmount { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Usage limit must be 0 or greater")]
    public int? UsageLimit { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Used count must be 0 or greater")]
    public int? UsedCount { get; set; }

    [RegularExpression("^(active|inactive|expired)$", ErrorMessage = "Status must be 'active', 'inactive', or 'expired'")]
    public string? Status { get; set; }
}

public class PromotionResponseDto
{
    public int PromoId { get; set; }
    public string? PromoCode { get; set; }
    public string? Description { get; set; }
    public string? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int? UsageLimit { get; set; }
    public int? UsedCount { get; set; }
    public string? Status { get; set; }
}

public class PromotionQueryParams
{
    public string? Keyword { get; set; }
    public string? PromoCode { get; set; }
    public string? Status { get; set; } // active | inactive | expired
    public string? DiscountType { get; set; } // percent | fixed
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "start_date"; // promo_code | start_date | end_date | discount_value
    public string? SortDir { get; set; } = "desc"; // asc | desc
}
