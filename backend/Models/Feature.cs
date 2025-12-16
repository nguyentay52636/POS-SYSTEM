using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Feature
{
    public int FeatureId { get; set; }

    public string FeatureName { get; set; } = null!;

    public int? ParentId { get; set; }

    public string? RoutePath { get; set; }

    public string? Icon { get; set; }

    public int DisplayOrder { get; set; }

    public string? Description { get; set; }

    public virtual Feature? Parent { get; set; }

    public virtual ICollection<Feature> Children { get; set; } = new List<Feature>();
}
