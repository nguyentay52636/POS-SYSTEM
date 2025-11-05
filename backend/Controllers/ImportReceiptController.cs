using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Import Receipt management endpoints
/// </summary>
[ApiController]
[Route("api/imports")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Import Receipts")]
public class ImportReceiptController : ControllerBase
{
    private readonly IImportReceiptService _service;

    public ImportReceiptController(IImportReceiptService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all import receipts with optional filtering
    /// </summary>

    [HttpGet]
    [ProducesResponseType(typeof(ImportReceiptResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<ImportReceiptResponseDto[]>> List(
    )
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }


    /// <summary>
    /// Get import receipt details by ID (including items)
    /// </summary>
    /// <param name="id">Import receipt ID</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ImportReceiptDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ImportReceiptDetailResponseDto>> GetById(int id)
    {
        var importReceipt = await _service.GetByIdAsync(id);
        if (importReceipt == null) return NotFound();
        return Ok(importReceipt);
    }

    /// <summary>
    /// Create a new import receipt
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ImportReceiptResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ImportReceiptResponseDto>> Create([FromBody] CreateImportReceiptDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ImportId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Add items to an import receipt
    /// </summary>
    /// <param name="id">Import receipt ID</param>
    /// <param name="dto">List of items to add</param>
    [HttpPost("{id:int}/items")]
    [ProducesResponseType(typeof(ImportItemResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ImportItemResponseDto[]>> AddItems(int id, [FromBody] AddImportItemsDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var items = await _service.AddItemsAsync(id, dto);
            return Ok(items);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update import receipt status
    /// </summary>
    /// <param name="id">Import receipt ID</param>
    /// <param name="dto">Status update data</param>
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(typeof(ImportReceiptResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ImportReceiptResponseDto>> UpdateStatus(int id, [FromBody] UpdateImportStatusDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateStatusAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete an import receipt
    /// </summary>
    /// <param name="id">Import receipt ID</param>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Get import receipt items
    /// </summary>
    /// <param name="id">Import receipt ID</param>
    [HttpGet("{id:int}/items")]
    [ProducesResponseType(typeof(ImportItemResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ImportItemResponseDto[]>> GetItems(int id)
    {
        try
        {
            var items = await _service.GetItemsAsync(id);
            return Ok(items);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get import statistics
    /// </summary>
    /// <param name="from">Start date for statistics</param>
    /// <param name="to">End date for statistics</param>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(ImportStatsResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ImportStatsResponseDto>> GetStats(
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var stats = await _service.GetStatsAsync(from, to);
        return Ok(stats);
    }
}

