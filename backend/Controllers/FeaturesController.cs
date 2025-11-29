using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeaturesController : ControllerBase
{
    private readonly IFeatureService _service;

    public FeaturesController(IFeatureService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FeatureResponseDto>>> GetFeatures()
    {
        var features = await _service.ListAllAsync();
        return Ok(features);
    }

    [HttpPost]
    public async Task<ActionResult<FeatureResponseDto>> CreateFeature(CreateFeatureDto dto)
    {
        var feature = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetFeatures), new { id = feature.FeatureId }, feature);
    }
}
