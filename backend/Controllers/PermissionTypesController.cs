using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/permission-types")]
public class PermissionTypesController : ControllerBase
{
    private readonly IPermissionTypeService _service;

    public PermissionTypesController(IPermissionTypeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PermissionTypeResponseDto>>> GetPermissionTypes()
    {
        var types = await _service.ListAllAsync();
        return Ok(types);
    }
}
