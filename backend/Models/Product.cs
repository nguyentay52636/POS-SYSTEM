using System;

namespace backend.Models;

public class Product
{
public int ProductId { get; set; }
public string? Barcode { get; set; }
public int? CategoryId { get; set; }
public DateTime? CreatedAt { get; set; }
public decimal? Price { get; set; }
public string? ProductName { get; set; }
public int? SupplierId { get; set; }
public string? Unit { get; set; }
}
