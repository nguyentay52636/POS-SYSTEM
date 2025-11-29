using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTOs for ExportItem
public class CreateExportItemDto
{
    [Required(ErrorMessage = "Product ID is required")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Quantity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "Unit price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
    public decimal UnitPrice { get; set; }
}

public class ExportItemResponseDto
{
    public int ExportItemId { get; set; }
    public int ExportId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? Barcode { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}

// DTOs for ExportReceipt
public class CreateExportReceiptDto
{
    [Required(ErrorMessage = "Customer ID is required")]
    public int CustomerId { get; set; }

    [Required(ErrorMessage = "User ID is required")]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Export items are required")]
    [MinLength(1, ErrorMessage = "At least one export item is required")]
    public List<CreateExportItemDto> ExportItems { get; set; } = new List<CreateExportItemDto>();

    [RegularExpression("^(pending|completed|canceled)$", ErrorMessage = "Status must be 'pending', 'completed', or 'canceled'")]
    public string Status { get; set; } = "pending";

    public string? Note { get; set; }
}

public class UpdateExportReceiptStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [RegularExpression("^(pending|completed|canceled)$", ErrorMessage = "Status must be 'pending', 'completed', or 'canceled'")]
    public string Status { get; set; } = string.Empty;
}

public class ExportReceiptResponseDto
{
    public int ExportId { get; set; }
    public int CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime? ExportDate { get; set; }
    public string? Status { get; set; }
    public decimal? TotalAmount { get; set; }
    public string? Note { get; set; }
    public List<ExportItemResponseDto> ExportItems { get; set; } = new List<ExportItemResponseDto>();
}

public class ExportReceiptDetailResponseDto
{
    public int ExportId { get; set; }
    public int CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime? ExportDate { get; set; }
    public string? Status { get; set; }
    public decimal? TotalAmount { get; set; }
    public string? Note { get; set; }
    public List<ExportItemResponseDto> ExportItems { get; set; } = new List<ExportItemResponseDto>();
}

public class ExportReceiptQueryParams
{
    public int? CustomerId { get; set; }
    public int? UserId { get; set; }
    public string? Status { get; set; } // pending | completed | canceled
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "export_date"; // export_date | total_amount | status
    public string? SortDir { get; set; } = "desc"; // asc | desc
}

