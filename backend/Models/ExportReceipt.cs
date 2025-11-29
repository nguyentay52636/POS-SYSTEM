using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ExportReceipt
{
    public int ExportId { get; set; }

    public int CustomerId { get; set; }

    public int UserId { get; set; }

    public DateTime? ExportDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string Status { get; set; } = null!;

    public string? Note { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<ExportItem> ExportItems { get; set; } = new List<ExportItem>();

    public virtual User User { get; set; } = null!;
}
