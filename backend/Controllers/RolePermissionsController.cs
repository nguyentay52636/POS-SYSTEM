using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/roles/{roleId}/permissions")]
public class RolePermissionsController : ControllerBase
{
    private readonly IRolePermissionService _service;

    public RolePermissionsController(IRolePermissionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RolePermissionResponseDto>>> GetRolePermissions(int roleId)
    {
        var permissions = await _service.GetByRoleIdAsync(roleId);
        return Ok(permissions);
    }

    [HttpPost]
    public async Task<ActionResult<RolePermissionResponseDto>> CreateRolePermission(int roleId, CreateRolePermissionDto dto)
    {
        var permission = await _service.CreateOrUpdateAsync(roleId, dto);
        return Ok(permission);
    }

    [HttpPut("bulk")]
    public async Task<ActionResult> UpdateRolePermissionsBulk(int roleId, BulkUpdateRolePermissionDto dto)
    {
        await _service.UpdateBulkAsync(roleId, dto);
        return NoContent();
    }
}
