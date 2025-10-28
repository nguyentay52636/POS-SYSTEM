using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Supplier management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Suppliers")]
public class SupplierController : ControllerBase
{
    private readonly ISupplierService _service;

    public SupplierController(ISupplierService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all suppliers (simple, no pagination).
    /// </summary>
    /// <returns>Array of suppliers.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(SupplierResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<SupplierResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get a supplier by id.
    /// </summary>
    /// <param name="id">Supplier id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SupplierResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplierResponseDto>> GetById(int id)
    {
        var supplier = await _service.GetByIdAsync(id);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }

    /// <summary>
    /// Get a supplier by name.
    /// </summary>
    /// <param name="name">Supplier name</param>
    [HttpGet("by-name/{name}")]
    [ProducesResponseType(typeof(SupplierResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplierResponseDto>> GetByName(string name)
    {
        var supplier = await _service.GetByNameAsync(name);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }

    /// <summary>
    /// Get a supplier by email.
    /// </summary>
    /// <param name="email">Supplier email</param>
    [HttpGet("by-email/{email}")]
    [ProducesResponseType(typeof(SupplierResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplierResponseDto>> GetByEmail(string email)
    {
        var supplier = await _service.GetByEmailAsync(email);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }

    /// <summary>
    /// Search suppliers with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<SupplierResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<SupplierResponseDto>>> Search([FromQuery] SupplierQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new supplier.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(SupplierResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SupplierResponseDto>> Create([FromBody] CreateSupplierDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.SupplierId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing supplier.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(SupplierResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SupplierResponseDto>> Update(int id, [FromBody] UpdateSupplierDto dto)
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
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a supplier by id.
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
    /// Bulk import suppliers from a JSON array.
    /// </summary>
    [HttpPost("import-json")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ImportJson([FromBody] IEnumerable<CreateSupplierDto> suppliers)
    {
        var count = await _service.ImportAsync(suppliers);
        return Ok(new { inserted = count });
    }
}
