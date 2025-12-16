using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class CustomerPointsHistory
{
    public int HistoryId { get; set; }

    public int CustomerId { get; set; }

    public int? OrderId { get; set; }

    public int PointsEarned { get; set; }

    public int PointsUsed { get; set; }

    public int PointsBalance { get; set; }

    public string TransactionType { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Order? Order { get; set; }
}
