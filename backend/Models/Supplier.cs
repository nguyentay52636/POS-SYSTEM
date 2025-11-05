using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Supplier
{
    public int SupplierId { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<ImportReceipt> ImportReceipts { get; set; } = new List<ImportReceipt>();
}
