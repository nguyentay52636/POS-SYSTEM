namespace backend.DTOs;

public class PermissionTypeResponseDto
{
    public int PermissionTypeId { get; set; }
    public string PermissionName { get; set; } = null!;
    public string Code { get; set; } = null!;
}
