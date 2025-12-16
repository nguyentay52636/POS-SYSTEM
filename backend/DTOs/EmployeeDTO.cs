namespace backend.DTOs;

public class EmployeeDTO
{
    public int EmployeeId { get; set; }
    public string FullName { get; set; } = null!;
    public string? Gender { get; set; }
    public DateOnly? BirthDate { get; set; }
    public string? Phone { get; set; }
    public string? RolePosition { get; set; }
    public string Status { get; set; } = "active";
}

public class CreateEmployeeDTO
{
    public string FullName { get; set; } = null!;
    public string? Gender { get; set; }
    public DateOnly? BirthDate { get; set; }
    public string? Phone { get; set; }
    public string? RolePosition { get; set; }
}

public class UpdateEmployeeDTO
{
    public string? FullName { get; set; }
    public string? Gender { get; set; }
    public DateOnly? BirthDate { get; set; }
    public string? Phone { get; set; }
    public string? RolePosition { get; set; }
    public string? Status { get; set; }
}
