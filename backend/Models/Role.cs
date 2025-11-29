using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
