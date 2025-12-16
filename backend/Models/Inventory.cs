using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public int ProductId { get; set; }

    public int? Quantity { get; set; }

    public string Status { get; set; } = "available";

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;
}
