using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ExportItem
{
    public int ExportItemId { get; set; }

    public int ExportId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }

    public virtual ExportReceipt Export { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
