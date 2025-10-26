using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Inventory management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all inventory records.
    /// </summary>
    /// <returns>Array of inventory records.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(InventoryResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<InventoryResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get inventory by product ID.
    /// </summary>
    /// <param name="productId">Product ID</param>
    [HttpGet("{productId:int}")]
    [ProducesResponseType(typeof(InventoryResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InventoryResponseDto>> GetByProductId(int productId)
    {
        var inventory = await _service.GetByProductIdAsync(productId);
        if (inventory == null) return NotFound();
        return Ok(inventory);
    }

    /// <summary>
    /// Update inventory quantity for a product (stock in/out).
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="dto">Updated quantity data</param>
    /// <remarks>
    /// Sample request:
    ///
    ///     PUT /api/inventory/1
    ///     {
    ///         "quantity": 150
    ///     }
    /// </remarks>
    [HttpPut("{productId:int}")]
    [ProducesResponseType(typeof(InventoryResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InventoryResponseDto>> Update(int productId, [FromBody] UpdateInventoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateAsync(productId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
