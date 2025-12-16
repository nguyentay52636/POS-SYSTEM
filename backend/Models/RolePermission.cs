using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class RolePermission
{
    public int RolePermissionId { get; set; }

    public int RoleId { get; set; }

    public int FeatureId { get; set; }

    public int PermissionTypeId { get; set; }

    public bool? IsAllowed { get; set; }

    public virtual Feature Feature { get; set; } = null!;

    public virtual PermissionType PermissionType { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
