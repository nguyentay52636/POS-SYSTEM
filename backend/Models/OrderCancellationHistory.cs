using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class OrderCancellationHistory
{
    public int CancellationId { get; set; }

    public int OrderId { get; set; }

    public string? CancellationReason { get; set; }

    public int CanceledByEmployeeId { get; set; }

    public DateTime? CancellationDate { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Employee CanceledByEmployee { get; set; } = null!;
}
