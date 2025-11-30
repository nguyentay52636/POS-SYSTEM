using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateFeatureDto
{
    [Required(ErrorMessage = "Feature name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Feature name must be between 2 and 100 characters")]
    public string FeatureName { get; set; } = string.Empty;
}

public class UpdateFeatureDto
{
    [Required(ErrorMessage = "Feature name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Feature name must be between 2 and 100 characters")]
    public string FeatureName { get; set; } = string.Empty;
}

public class FeatureResponseDto
{
    public int FeatureId { get; set; }
    public string? FeatureName { get; set; }
}
