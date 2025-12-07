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

/// <summary>
/// DTO để admin cập nhật permissions cho role với format đơn giản
/// </summary>
public class UpdateRolePermissionsDto
{
    /// <summary>
    /// Danh sách permissions theo format: { featureId, permissionTypeIds[] }
    /// </summary>
    public List<FeaturePermissionDto> FeaturePermissions { get; set; } = new List<FeaturePermissionDto>();
}

public class FeaturePermissionDto
{
    [Required(ErrorMessage = "FeatureId is required")]
    public int FeatureId { get; set; }
    
    /// <summary>
    /// Danh sách PermissionTypeId được phép (1=View, 2=Create, 3=Update, 4=Delete, 5=Print, 6=Export)
    /// </summary>
    public List<int> PermissionTypeIds { get; set; } = new List<int>();
}
