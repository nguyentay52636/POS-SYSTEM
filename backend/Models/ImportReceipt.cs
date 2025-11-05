using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ImportReceipt
{
    public int ImportId { get; set; }

    public int SupplierId { get; set; }

    public int UserId { get; set; }

    public DateTime? ImportDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? Status { get; set; }

    public string? Note { get; set; }

    public virtual ICollection<ImportItem> ImportItems { get; set; } = new List<ImportItem>();

    public virtual Supplier Supplier { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
