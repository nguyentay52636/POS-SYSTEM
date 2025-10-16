using System;

namespace backend.Models;

public class Payment
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
    public int OrderId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? PaymentMethod { get; set; }
}
