using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Feature management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Features")]
public class FeatureController : ControllerBase
{
    private readonly IFeatureService _service;

    public FeatureController(IFeatureService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all features.
    /// </summary>
    /// <returns>Array of features.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(FeatureResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<FeatureResponseDto[]>> GetAll()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get a feature by id.
    /// </summary>
    /// <param name="id">Feature id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(FeatureResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeatureResponseDto>> GetById(int id)
    {
        var feature = await _service.GetByIdAsync(id);
        if (feature == null) return NotFound();
        return Ok(feature);
    }

    /// <summary>
    /// Create a new feature.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(FeatureResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FeatureResponseDto>> Create([FromBody] CreateFeatureDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.FeatureId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing feature.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(FeatureResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FeatureResponseDto>> Update(int id, [FromBody] UpdateFeatureDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a feature by id.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }
}

