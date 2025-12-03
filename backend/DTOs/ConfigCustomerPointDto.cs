using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ConfigCustomerPointResponseDto
{
    public int ConfigId { get; set; }
    public decimal PointsPerUnit { get; set; }
    public decimal MoneyPerUnit { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateConfigCustomerPointDto
{
    [Required(ErrorMessage = "Points per unit is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Points per unit must be greater than 0")]
    public decimal PointsPerUnit { get; set; }

    [Required(ErrorMessage = "Money per unit is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Money per unit must be greater than 0")]
    public decimal MoneyPerUnit { get; set; }
}

public class AddCustomerPointDto
{
    [Required(ErrorMessage = "Points is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Points must be greater than 0")]
    public decimal Points { get; set; }
}
