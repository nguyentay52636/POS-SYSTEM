using System;

namespace backend.Models;

public partial class ConfigCustomerPoint
{
    public int ConfigId { get; set; }

    public decimal PointsPerUnit { get; set; }

    public decimal MoneyPerUnit { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
