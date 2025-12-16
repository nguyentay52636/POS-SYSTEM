using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class InventoryHistory
{
    public int HistoryId { get; set; }

    public int ProductId { get; set; }

    public int? OldQuantity { get; set; }

    public int? NewQuantity { get; set; }

    public int? Difference { get; set; }

    public string? ChangeType { get; set; }

    public string? Reason { get; set; }

    public string? Note { get; set; }

    public int? EmployeeId { get; set; }

    public DateTime? ChangeDate { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Employee? Employee { get; set; }
}
