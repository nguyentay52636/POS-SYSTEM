using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateFeatureDto
{
    [Required]
    [MaxLength(100)]
    public string FeatureName { get; set; } = null!;

    [MaxLength(255)]
    public string? Description { get; set; }
}

public class FeatureResponseDto
{
    public int FeatureId { get; set; }
    public string FeatureName { get; set; } = null!;
    public string? Description { get; set; }
}
