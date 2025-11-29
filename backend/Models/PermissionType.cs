using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PermissionType
{
    public int PermissionTypeId { get; set; }

    public string PermissionName { get; set; } = null!;
}
