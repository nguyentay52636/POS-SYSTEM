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
    [Permission("Employee", "VIEW")]
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

    [HttpGet("{id}")]
    [Permission("Employee", "VIEW")]
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
    [Permission("Employee", "CREATE")]
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
    [Permission("Employee", "UPDATE")]
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

    [HttpDelete("{id}")]
    [Permission("Employee", "DELETE")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(new { success = false, message = $"Employee with ID {id} not found" });

            return Ok(new { success = true, message = "Employee deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
