using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Promotion
{
    public int PromoId { get; set; }

    public string? Description { get; set; }

    public string? DiscountType { get; set; }

    public decimal? DiscountValue { get; set; }

    public DateTime? EndDate { get; set; }

    public decimal? MinOrderAmount { get; set; }

    public string? PromoCode { get; set; }

    public DateTime? StartDate { get; set; }

    public string? Status { get; set; }

    public int? UsageLimit { get; set; }

    public int? UsedCount { get; set; }
}
