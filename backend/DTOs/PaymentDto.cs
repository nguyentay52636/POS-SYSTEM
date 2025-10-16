using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

/// <summary>
/// DTO for creating a new payment
/// </summary>
public class CreatePaymentDto
{
    [Required(ErrorMessage = "Order ID is required")]
    public int OrderId { get; set; }

    [Required(ErrorMessage = "Amount is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Payment method is required")]
    [StringLength(50, ErrorMessage = "Payment method cannot exceed 50 characters")]
    public string PaymentMethod { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating an existing payment
/// </summary>
public class UpdatePaymentDto
{
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal? Amount { get; set; }

    [StringLength(50, ErrorMessage = "Payment method cannot exceed 50 characters")]
    public string? PaymentMethod { get; set; }

    public DateTime? PaymentDate { get; set; }
}

/// <summary>
/// DTO for payment search and filtering
/// </summary>
public class PaymentQueryParams
{
    public int? OrderId { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "payment_date"; // payment_date | amount
    public string? SortDir { get; set; } = "desc"; // asc | desc
}

/// <summary>
/// DTO for payment details with order information
/// </summary>
public class PaymentDetailResponseDto
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime? PaymentDate { get; set; }

    // Order details
    public string? OrderStatus { get; set; }
    public decimal? OrderTotalAmount { get; set; }
    public string? CustomerName { get; set; }
}
