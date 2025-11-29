using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateRolePermissionDto
{
    [Required]
    public int FeatureId { get; set; }

    [Required]
    public int PermissionTypeId { get; set; }

    public bool IsAllowed { get; set; }
}

public class RolePermissionResponseDto
{
    public int RolePermissionId { get; set; }
    public int RoleId { get; set; }
    public int FeatureId { get; set; }
    public string FeatureName { get; set; } = null!;
    public int PermissionTypeId { get; set; }
    public string PermissionName { get; set; } = null!;
    public string PermissionCode { get; set; } = null!;
    public bool IsAllowed { get; set; }
}

public class BulkUpdateRolePermissionDto
{
    public List<CreateRolePermissionDto> Permissions { get; set; } = new List<CreateRolePermissionDto>();
}
