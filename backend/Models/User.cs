using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class User
{
    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? FullName { get; set; }

    public string? Password { get; set; }

    public int Role { get; set; }

    public string? Username { get; set; }

    public virtual ICollection<ImportReceipt> ImportReceipts { get; set; } = new List<ImportReceipt>();
}
