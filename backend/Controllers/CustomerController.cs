using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Customer management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Customers")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomerController(ICustomerService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all customers (simple, no pagination).
    /// </summary>
    /// <returns>Array of customers.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(CustomerResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<CustomerResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get a customer by id.
    /// </summary>
    /// <param name="id">Customer id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CustomerResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponseDto>> GetById(int id)
    {
        var customer = await _service.GetByIdAsync(id);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    /// <summary>
    /// Get a customer by name.
    /// </summary>
    /// <param name="name">Customer name</param>
    [HttpGet("by-name/{name}")]
    [ProducesResponseType(typeof(CustomerResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponseDto>> GetByName(string name)
    {
        var customer = await _service.GetByNameAsync(name);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    /// <summary>
    /// Get a customer by email.
    /// </summary>
    /// <param name="email">Customer email</param>
    [HttpGet("by-email/{email}")]
    [ProducesResponseType(typeof(CustomerResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponseDto>> GetByEmail(string email)
    {
        var customer = await _service.GetByEmailAsync(email);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    /// <summary>
    /// Search customers with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<CustomerResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<CustomerResponseDto>>> Search([FromQuery] CustomerQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new customer.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CustomerResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerResponseDto>> Create([FromBody] CreateCustomerDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.CustomerId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing customer.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CustomerResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerResponseDto>> Update(int id, [FromBody] UpdateCustomerDto dto)
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
    /// Delete a customer by id.
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
    /// Bulk import customers from a JSON array.
    /// </summary>
    [HttpPost("import-json")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ImportJson([FromBody] IEnumerable<CreateCustomerDto> customers)
    {
        var count = await _service.ImportAsync(customers);
        return Ok(new { inserted = count });
    }
}
