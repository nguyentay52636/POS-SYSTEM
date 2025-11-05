using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int? CustomerId { get; set; }

    public decimal? DiscountAmount { get; set; }

    public DateTime? OrderDate { get; set; }

    public int? PromoId { get; set; }

    public string? Status { get; set; }

    public decimal? TotalAmount { get; set; }

    public int? UserId { get; set; }
}
