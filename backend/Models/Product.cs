using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int? CategoryId { get; set; }

    public int? SupplierId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? Barcode { get; set; }

    public string Status { get; set; } = "active"; // trạng thái sản phẩm: đang bán hoặc huỷ bán

    public decimal Price { get; set; }

    public string? Unit { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? ImageUrl { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<ExportItem> ExportItems { get; set; } = new List<ExportItem>();

    public virtual ICollection<ImportItem> ImportItems { get; set; } = new List<ImportItem>();

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<PromotionProduct> PromotionProducts { get; set; } = new List<PromotionProduct>();

    public virtual ICollection<InventoryHistory> InventoryHistories { get; set; } = new List<InventoryHistory>();

    public virtual ICollection<ProfitRule> ProfitRules { get; set; } = new List<ProfitRule>();

    public virtual Supplier? Supplier { get; set; }
}
