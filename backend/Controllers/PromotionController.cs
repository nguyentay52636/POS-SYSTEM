using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Promotion management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Promotions")]
public class PromotionController : ControllerBase
{
    private readonly IPromotionService _service;

    public PromotionController(IPromotionService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all promotions (simple, no pagination).
    /// </summary>
    /// <returns>Array of promotions.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PromotionResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<PromotionResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get a promotion by id.
    /// </summary>
    /// <param name="id">Promotion id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PromotionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PromotionResponseDto>> GetById(int id)
    {
        var promotion = await _service.GetByIdAsync(id);
        if (promotion == null) return NotFound();
        return Ok(promotion);
    }

    /// <summary>
    /// Get a promotion by promo code.
    /// </summary>
    /// <param name="code">Promotion code</param>
    [HttpGet("by-code/{code}")]
    [ProducesResponseType(typeof(PromotionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PromotionResponseDto>> GetByPromoCode(string code)
    {
        var promotion = await _service.GetByPromoCodeAsync(code);
        if (promotion == null) return NotFound();
        return Ok(promotion);
    }

    /// <summary>
    /// Get all active promotions.
    /// </summary>
    /// <returns>Array of active promotions.</returns>
    [HttpGet("active")]
    [ProducesResponseType(typeof(PromotionResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<PromotionResponseDto[]>> GetActivePromotions()
    {
        var result = await _service.GetActivePromotionsAsync();
        return Ok(result);
    }

    /// <summary>
    /// Search promotions with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<PromotionResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<PromotionResponseDto>>> Search([FromQuery] PromotionQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Validate and apply a promotion code to an order.
    /// </summary>
    /// <param name="code">Promotion code</param>
    /// <param name="orderAmount">Order amount to validate against</param>
    [HttpGet("validate/{code}")]
    [ProducesResponseType(typeof(PromotionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PromotionResponseDto>> ValidatePromotion(string code, [FromQuery] decimal orderAmount)
    {
        try
        {
            var promotion = await _service.ValidateAndApplyPromotionAsync(code, orderAmount);
            if (promotion == null) return NotFound();
            return Ok(promotion);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a new promotion.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(PromotionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PromotionResponseDto>> Create([FromBody] CreatePromotionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.PromoId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing promotion.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PromotionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PromotionResponseDto>> Update(int id, [FromBody] UpdatePromotionDto dto)
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
    /// Delete a promotion by id.
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

    /// <summary>
    /// Bulk import promotions from a JSON array.
    /// </summary>
    [HttpPost("import-json")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ImportJson([FromBody] IEnumerable<CreatePromotionDto> promotions)
    {
        var count = await _service.ImportAsync(promotions);
        return Ok(new { inserted = count });
    }
}
