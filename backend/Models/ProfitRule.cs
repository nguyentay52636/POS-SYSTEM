using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ProfitRule
{
    public int RuleId { get; set; }

    public string RuleType { get; set; } = "by_product";

    public int ProductId { get; set; }

    public decimal ProfitPercentage { get; set; }

    public int Priority { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? EmployeeId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Employee? Employee { get; set; }
}
