using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigCustomerPointController : ControllerBase
{
    private readonly IConfigCustomerPointService _service;

    public ConfigCustomerPointController(IConfigCustomerPointService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lấy cấu hình tích điểm hiện tại
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ConfigCustomerPointResponseDto>> GetActiveConfig()
    {
        var config = await _service.GetActiveConfigAsync();
        if (config == null)
        {
            return NotFound(new { message = "Không tìm thấy cấu hình tích điểm" });
        }
        return Ok(config);
    }

    /// <summary>
    /// Cập nhật cấu hình tích điểm (chỉ admin)
    /// </summary>
    [HttpPut]
    public async Task<ActionResult<ConfigCustomerPointResponseDto>> UpdateConfig([FromBody] UpdateConfigCustomerPointDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateConfigAsync(dto);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Tính giá trị tiền từ điểm
    /// </summary>
    [HttpGet("convert/{points}")]
    public async Task<ActionResult<decimal>> ConvertPointsToMoney(decimal points)
    {
        try
        {
            var money = await _service.ConvertPointsToMoneyAsync(points);
            return Ok(new { points, money });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
