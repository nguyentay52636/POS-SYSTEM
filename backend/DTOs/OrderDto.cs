using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTOs for OrderItem
public class CreateOrderItemDto
{
    [Required(ErrorMessage = "Product ID is required")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Quantity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }
}

public class OrderItemResponseDto
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? Barcode { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
}

// DTOs for Order
public class CreateOrderDto
{
    public int? CustomerId { get; set; }

    [Required(ErrorMessage = "User ID is required")]
    public int UserId { get; set; }

    public int? PromoId { get; set; }

    public string? PromoCode { get; set; }

    [Required(ErrorMessage = "Order items are required")]
    [MinLength(1, ErrorMessage = "At least one order item is required")]
    public List<CreateOrderItemDto> OrderItems { get; set; } = new List<CreateOrderItemDto>();

    [RegularExpression("^(pending|paid|canceled)$", ErrorMessage = "Status must be 'pending', 'paid', or 'canceled'")]
    public string Status { get; set; } = "pending";
}

public class UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [RegularExpression("^(pending|paid|canceled)$", ErrorMessage = "Status must be 'pending', 'paid', or 'canceled'")]
    public string Status { get; set; } = string.Empty;
}

public class OrderResponseDto
{
    public int OrderId { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public int? PromoId { get; set; }
    public string? PromoCode { get; set; }
    public DateTime? OrderDate { get; set; }
    public string? Status { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? TotalAmount { get; set; }
    public List<OrderItemResponseDto> OrderItems { get; set; } = new List<OrderItemResponseDto>();
}

public class OrderDetailResponseDto
{
    public int OrderId { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public int? PromoId { get; set; }
    public string? PromoCode { get; set; }
    public string? PromoDescription { get; set; }
    public DateTime? OrderDate { get; set; }
    public string? Status { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? TotalAmount { get; set; }
    public List<OrderItemResponseDto> OrderItems { get; set; } = new List<OrderItemResponseDto>();
    public List<PaymentResponseDto> Payments { get; set; } = new List<PaymentResponseDto>();
}

public class OrderQueryParams
{
    public int? CustomerId { get; set; }
    public int? UserId { get; set; }
    public string? Status { get; set; } // pending | paid | canceled
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "order_date"; // order_date | total_amount | status
    public string? SortDir { get; set; } = "desc"; // asc | desc
}

// Payment DTOs
public class PaymentResponseDto
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime? PaymentDate { get; set; }
}
