using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
    public string ProductName { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Barcode cannot exceed 50 characters")]
    public string? Barcode { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [StringLength(50, ErrorMessage = "Unit cannot exceed 50 characters")]
    public string? Unit { get; set; }

    [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters")]
    public string? ImageUrl { get; set; }


    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Supplier ID is required")]
    public int SupplierId { get; set; }
}

public class CreateProductWithFileDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
    public string ProductName { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Barcode cannot exceed 50 characters")]
    public string? Barcode { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [StringLength(50, ErrorMessage = "Unit cannot exceed 50 characters")]
    public string? Unit { get; set; }

    [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters")]
    public string? ImageUrl { get; set; }

    public IFormFile? ImageFile { get; set; }

    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Supplier ID is required")]
    public int SupplierId { get; set; }
}

public class UpdateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
    public string ProductName { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Barcode cannot exceed 50 characters")]
    public string? Barcode { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters")]
    public string? ImageUrl { get; set; }

    [StringLength(50, ErrorMessage = "Unit cannot exceed 50 characters")]
    public string? Unit { get; set; }

    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Supplier ID is required")]
    public int SupplierId { get; set; }
}

public class ProductResponseDto
{
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ImageUrl { get; set; }
    public string? Barcode { get; set; }
    public decimal? Price { get; set; }
    public string? Unit { get; set; }
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public CategoryResponseDto? Category { get; set; }
    public SupplierResponseDto? Supplier { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class ProductQueryParams
{
    public string? Keyword { get; set; }
    public string? ProductName { get; set; }
    public string? Barcode { get; set; }
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "name"; // name | price | created | id
    public string? SortDir { get; set; } = "asc"; // asc | desc
}
