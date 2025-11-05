using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PromotionProduct
{
    public int PromotionProductId { get; set; }

    public int ProductId { get; set; }

    public int PromoId { get; set; }
}
