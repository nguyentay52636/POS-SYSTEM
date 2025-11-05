using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTOs for ImportItem
public class CreateImportItemDto
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

public class ImportItemResponseDto
{
    public int ImportItemId { get; set; }
    public int ImportId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? Barcode { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}

// DTOs for ImportReceipt
public class CreateImportReceiptDto
{
    [Required(ErrorMessage = "Supplier ID is required")]
    public int SupplierId { get; set; }

    [Required(ErrorMessage = "User ID is required")]
    public int UserId { get; set; }

    public string? Note { get; set; }

    [RegularExpression("^(pending|completed|canceled)$", ErrorMessage = "Status must be 'pending', 'completed', or 'canceled'")]
    public string Status { get; set; } = "pending";
}

public class UpdateImportStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [RegularExpression("^(pending|completed|canceled)$", ErrorMessage = "Status must be 'pending', 'completed', or 'canceled'")]
    public string Status { get; set; } = string.Empty;
}

public class AddImportItemsDto
{
    [Required(ErrorMessage = "Import items are required")]
    [MinLength(1, ErrorMessage = "At least one import item is required")]
    public List<CreateImportItemDto> Items { get; set; } = new List<CreateImportItemDto>();
}

public class ImportReceiptResponseDto
{
    public int ImportId { get; set; }
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public SupplierResponseDto? Supplier { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public UserResponseDto? User { get; set; }
    public DateTime? ImportDate { get; set; }
    public decimal? TotalAmount { get; set; }
    public string? Status { get; set; }
    public string? Note { get; set; }
    public List<ImportItemResponseDto> ImportItems { get; set; } = new List<ImportItemResponseDto>();
}

public class ImportReceiptDetailResponseDto
{
    public int ImportId { get; set; }
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public string? SupplierEmail { get; set; }
    public string? SupplierPhone { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime? ImportDate { get; set; }
    public decimal? TotalAmount { get; set; }
    public string? Status { get; set; }
    public string? Note { get; set; }
    public List<ImportItemResponseDto> ImportItems { get; set; } = new List<ImportItemResponseDto>();
}

public class ImportReceiptQueryParams
{
    public int? SupplierId { get; set; }
    public int? UserId { get; set; }
    public string? Status { get; set; } // pending | completed | canceled
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "import_date"; // import_date | total_amount | status
    public string? SortDir { get; set; } = "desc"; // asc | desc
}

public class ImportStatsResponseDto
{
    public int TotalImports { get; set; }
    public decimal TotalAmount { get; set; }
    public int PendingImports { get; set; }
    public int CompletedImports { get; set; }
    public int CanceledImports { get; set; }
    public List<ImportStatsBySupplierDto> BySupplier { get; set; } = new List<ImportStatsBySupplierDto>();
}

public class ImportStatsBySupplierDto
{
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public int ImportCount { get; set; }
    public decimal TotalAmount { get; set; }
}

