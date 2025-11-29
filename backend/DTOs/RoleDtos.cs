using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateRoleDto
{
    [Required]
    [MaxLength(50)]
    public string RoleName { get; set; } = null!;

    [MaxLength(255)]
    public string? Description { get; set; }
}

public class UpdateRoleDto
{
    [Required]
    [MaxLength(50)]
    public string RoleName { get; set; } = null!;

    [MaxLength(255)]
    public string? Description { get; set; }
}

public class RoleResponseDto
{
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public string? Description { get; set; }
}
