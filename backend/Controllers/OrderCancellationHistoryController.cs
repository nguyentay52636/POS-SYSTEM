using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Attributes;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderCancellationHistoryController : ControllerBase
{
    private readonly IOrderCancellationHistoryService _service;

    public OrderCancellationHistoryController(IOrderCancellationHistoryService service)
    {
        _service = service;
    }

    [HttpGet("order/{orderId}")]
    [Permission("Order", "VIEW")]
    public async Task<IActionResult> GetByOrderId(int orderId)
    {
        try
        {
            var history = await _service.GetByOrderIdAsync(orderId);
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
