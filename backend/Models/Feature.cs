using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Feature
{
    public int FeatureId { get; set; }

    public string FeatureName { get; set; } = null!;
}
