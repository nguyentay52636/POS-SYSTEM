using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using backend.Attributes;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeeController(IEmployeeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? status = null)
    {
        try
        {
            var employees = await _service.ListAllAsync(status);
            return Ok(new { success = true, data = employees });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var employees = await _service.ListAllAsync();
            return Ok(new { success = true, data = employees });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var employee = await _service.GetByIdAsync(id);
            if (employee == null)
                return NotFound(new { success = false, message = $"Employee with ID {id} not found" });

            return Ok(new { success = true, data = employee });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDTO dto)
    {
        try
        {
            var employee = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, 
                new { success = true, data = employee });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDTO dto)
    {
        try
        {
            var employee = await _service.UpdateAsync(id, dto);
            return Ok(new { success = true, data = employee });
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

    [HttpPut("{id}/status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        try
        {
            var employee = await _service.ToggleStatusAsync(id);
            return Ok(new { success = true, data = employee, message = "Employee status updated successfully" });
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


}
