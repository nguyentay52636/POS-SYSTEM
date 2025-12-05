using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public DateTime? CreatedAt { get; set; }

    public decimal? CustomerPoint { get; set; }

    public virtual ICollection<ExportReceipt> ExportReceipts { get; set; } = new List<ExportReceipt>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    [System.ComponentModel.DataAnnotations.Schema.Column("IsDeleted")]
    [System.ComponentModel.DefaultValue(false)]
    public bool IsDeleted { get; set; }
}
