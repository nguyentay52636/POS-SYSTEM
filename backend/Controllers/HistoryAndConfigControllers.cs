using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Attributes;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerPointsHistoryController : ControllerBase
{
    private readonly ICustomerPointsHistoryService _service;

    public CustomerPointsHistoryController(ICustomerPointsHistoryService service)
    {
        _service = service;
    }

    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetByCustomerId(int customerId)
    {
        try
        {
            var history = await _service.GetByCustomerIdAsync(customerId);
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("order/{orderId}")]
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

[ApiController]
[Route("api/[controller]")]
public class InventoryHistoryController : ControllerBase
{
    private readonly IInventoryHistoryService _service;

    public InventoryHistoryController(IInventoryHistoryService service)
    {
        _service = service;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProductId(int productId)
    {
        try
        {
            var history = await _service.GetByProductIdAsync(productId);
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}

[ApiController]
[Route("api/[controller]")]
public class ProfitConfigurationController : ControllerBase
{
    private readonly IProfitConfigurationService _service;

    public ProfitConfigurationController(IProfitConfigurationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetCurrent()
    {
        try
        {
            var config = await _service.GetCurrentConfigurationAsync();
            if (config == null)
                return NotFound(new { success = false, message = "No profit configuration found" });

            return Ok(new { success = true, data = config });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] backend.DTOs.UpdateProfitConfigurationDTO dto)
    {
        try
        {
            var config = await _service.UpdateConfigurationAsync(dto);
            return Ok(new { success = true, data = config });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}

[ApiController]
[Route("api/[controller]")]
public class ProfitRuleController : ControllerBase
{
    private readonly IProfitRuleService _service;

    public ProfitRuleController(IProfitRuleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null)
    {
        try
        {
            var rules = await _service.GetAllAsync(status);
            return Ok(new { success = true, data = rules });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProductId(int productId)
    {
        try
        {
            var rule = await _service.GetByProductIdAsync(productId);
            if (rule == null)
                return NotFound(new { success = false, message = $"No profit rule found for product {productId}" });

            return Ok(new { success = true, data = rule });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] backend.DTOs.CreateProfitRuleDTO dto)
    {
        try
        {
            var rule = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByProductId), new { productId = rule.ProductId }, 
                new { success = true, data = rule });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{ruleId}")]
    public async Task<IActionResult> Update(int ruleId, [FromBody] backend.DTOs.UpdateProfitRuleDTO dto)
    {
        try
        {
            var rule = await _service.UpdateAsync(ruleId, dto);
            return Ok(new { success = true, data = rule });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{ruleId}")]
    public async Task<IActionResult> Delete(int ruleId)
    {
        try
        {
            var result = await _service.DeleteAsync(ruleId);
            if (!result)
                return NotFound(new { success = false, message = $"Profit rule with ID {ruleId} not found" });

            return Ok(new { success = true, message = "Profit rule deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
