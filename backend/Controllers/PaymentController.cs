using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Payment management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Payments")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _service;

    public PaymentController(IPaymentService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all payments (simple, no pagination).
    /// </summary>
    /// <returns>Array of payments.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PaymentResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaymentResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get payment details by id.
    /// </summary>
    /// <param name="id">Payment id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PaymentDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PaymentDetailResponseDto>> GetById(int id)
    {
        var payment = await _service.GetByIdAsync(id);
        if (payment == null) return NotFound();
        return Ok(payment);
    }

    /// <summary>
    /// Search payments with pagination and filtering.
    /// </summary>
    /// <param name="query">Search parameters including order ID, payment method, date range, amount range, and pagination</param>
    /// <returns>Paginated list of payments</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<PaymentResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<PaymentResponseDto>>> Search([FromQuery] PaymentQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get all payments for a specific order.
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Array of payments for the order</returns>
    [HttpGet("order/{orderId:int}")]
    [ProducesResponseType(typeof(PaymentResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PaymentResponseDto[]>> GetByOrderId(int orderId)
    {
        try
        {
            var payments = await _service.GetPaymentsByOrderIdAsync(orderId);
            return Ok(payments);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get total amount paid for a specific order.
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Total amount paid</returns>
    [HttpGet("order/{orderId:int}/total")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<decimal>> GetTotalByOrderId(int orderId)
    {
        try
        {
            var total = await _service.GetTotalPaymentsByOrderIdAsync(orderId);
            return Ok(new { orderId, totalPaid = total });
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a new payment for an order.
    /// </summary>
    /// <param name="dto">Payment creation data</param>
    /// <returns>Created payment details</returns>
    [HttpPost]
    [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaymentResponseDto>> Create([FromBody] CreatePaymentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.PaymentId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing payment.
    /// </summary>
    /// <param name="id">Payment ID</param>
    /// <param name="dto">Payment update data</param>
    /// <returns>Updated payment details</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaymentResponseDto>> Update(int id, [FromBody] UpdatePaymentDto dto)
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
    /// Delete a payment.
    /// </summary>
    /// <param name="id">Payment ID</param>
    /// <returns>No content if successful</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
