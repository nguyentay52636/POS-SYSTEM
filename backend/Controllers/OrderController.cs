using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Order management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Orders")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _service;

    public OrderController(IOrderService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all orders (simple, no pagination).
    /// </summary>
    /// <returns>Array of orders.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(OrderResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<OrderResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get order details by id.
    /// </summary>
    /// <param name="id">Order id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(OrderDetailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDetailResponseDto>> GetById(int id)
    {
        var order = await _service.GetByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    /// <summary>
    /// Search orders with pagination and filtering.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<OrderResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<OrderResponseDto>>> Search([FromQuery] OrderQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new order (including order items).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponseDto>> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.OrderId }, created);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"❌ ORDER CREATE FAILED: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update order status (pending → paid/canceled).
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponseDto>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
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
    /// Cancel a paid order with reason (refunds points and restores inventory).
    /// </summary>
    [HttpPut("{id:int}/cancel")]
    [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponseDto>> Cancel(int id, [FromBody] CancelOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var canceled = await _service.CancelOrderAsync(id, dto);
            if (canceled == null) return NotFound();
            return Ok(canceled);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get order items (products) in an order.
    /// </summary>
    /// <param name="id">Order id</param>
    [HttpGet("{id:int}/items")]
    [ProducesResponseType(typeof(OrderItemResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderItemResponseDto[]>> GetItems(int id)
    {
        try
        {
            var items = await _service.GetOrderItemsAsync(id);
            return Ok(items);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get payments related to an order.
    /// </summary>
    /// <param name="id">Order id</param>
    [HttpGet("{id:int}/payments")]
    [ProducesResponseType(typeof(PaymentResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PaymentResponseDto[]>> GetPayments(int id)
    {
        try
        {
            var payments = await _service.GetPaymentsAsync(id);
            return Ok(payments);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
