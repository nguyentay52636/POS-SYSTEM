using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Export Receipt management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Export Receipts")]
public class ExportReceiptController : ControllerBase
{
    private readonly IExportReceiptService _service;

    public ExportReceiptController(IExportReceiptService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all export receipts (simple, no pagination).
    /// </summary>
    /// <returns>Array of export receipts.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ExportReceiptResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<ExportReceiptResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get export receipt details by id.
    /// </summary>
    /// <param name="id">Export receipt id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ExportReceiptDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExportReceiptDetailResponseDto>> GetById(int id)
    {
        var exportReceipt = await _service.GetByIdAsync(id);
        if (exportReceipt == null) return NotFound();
        return Ok(exportReceipt);
    }

    /// <summary>
    /// Search export receipts with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<ExportReceiptResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<ExportReceiptResponseDto>>> Search([FromQuery] ExportReceiptQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new export receipt (including export items).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ExportReceiptResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ExportReceiptResponseDto>> Create([FromBody] CreateExportReceiptDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ExportId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update export receipt status (pending → completed/canceled).
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ExportReceiptResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ExportReceiptResponseDto>> UpdateStatus(int id, [FromBody] UpdateExportReceiptStatusDto dto)
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
    /// Cancel an export receipt (only pending export receipts can be canceled).
    /// </summary>
    [HttpPatch("{id:int}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Cancel(int id)
    {
        try
        {
            var ok = await _service.CancelExportReceiptAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get export items (products) in an export receipt.
    /// </summary>
    /// <param name="id">Export receipt id</param>
    [HttpGet("{id:int}/items")]
    [ProducesResponseType(typeof(ExportItemResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExportItemResponseDto[]>> GetItems(int id)
    {
        try
        {
            var items = await _service.GetExportItemsAsync(id);
            return Ok(items);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

