using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Gender { get; set; }

    public DateOnly? BirthDate { get; set; }

    public string? Phone { get; set; }

    public string? RolePosition { get; set; }

    public string Status { get; set; } = "active";

    public virtual ICollection<User> Users { get; set; } = new List<User>();

    public virtual ICollection<InventoryHistory> InventoryHistories { get; set; } = new List<InventoryHistory>();

    public virtual ICollection<OrderCancellationHistory> OrderCancellationHistories { get; set; } = new List<OrderCancellationHistory>();

    public virtual ICollection<ProfitConfiguration> ProfitConfigurations { get; set; } = new List<ProfitConfiguration>();

    public virtual ICollection<ProfitRule> ProfitRules { get; set; } = new List<ProfitRule>();
}
