using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ProfitConfiguration
{
    public int ConfigId { get; set; }

    public decimal DefaultProfitPercentage { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedByEmployeeId { get; set; }

    public virtual Employee? UpdatedByEmployee { get; set; }
}
