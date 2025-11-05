using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ImportItem
{
    public int ImportItemId { get; set; }

    public int ImportId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }

    public virtual ImportReceipt Import { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
