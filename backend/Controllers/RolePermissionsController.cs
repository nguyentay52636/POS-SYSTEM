using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Role Permission management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Role Permissions")]
public class RolePermissionsController : ControllerBase
{
    private readonly IRolePermissionService _service;

    public RolePermissionsController(IRolePermissionService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all role permissions.
    /// </summary>
    /// <returns>Array of all role permissions.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(RolePermissionResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<RolePermissionResponseDto[]>> GetAll()
    {
        var permissions = await _service.GetAllAsync();
        return Ok(permissions);
    }

    /// <summary>
    /// Get all permissions for a specific role.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <returns>Array of role permissions.</returns>
    [HttpGet("role/{roleId:int}")]
    [HttpGet("~/api/Roles/{roleId:int}/permissions")] // Route tương thích với frontend
    [ProducesResponseType(typeof(RolePermissionResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<RolePermissionResponseDto[]>> GetByRoleId(int roleId)
    {
        var permissions = await _service.GetByRoleIdAsync(roleId);
        return Ok(permissions);
    }

    /// <summary>
    /// Get a specific role permission by role, feature, and permission type.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="featureId">Feature ID</param>
    /// <param name="permissionTypeId">Permission Type ID</param>
    /// <returns>Role permission details.</returns>
    [HttpGet("role/{roleId:int}/feature/{featureId:int}/permission/{permissionTypeId:int}")]
    [ProducesResponseType(typeof(RolePermissionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RolePermissionResponseDto>> GetById(int roleId, int featureId, int permissionTypeId)
    {
        var permission = await _service.GetByIdAsync(roleId, featureId, permissionTypeId);
        if (permission == null) return NotFound();
        return Ok(permission);
    }

    /// <summary>
    /// Create a new role permission.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="dto">Permission data</param>
    /// <returns>Created role permission.</returns>
    [HttpPost("role/{roleId:int}")]
    [HttpPost("~/api/Roles/{roleId:int}/permissions")] // Route tương thích với frontend
    [ProducesResponseType(typeof(RolePermissionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RolePermissionResponseDto>> Create(int roleId, [FromBody] CreateRolePermissionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var permission = await _service.CreateAsync(roleId, dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { roleId = roleId, featureId = dto.FeatureId, permissionTypeId = dto.PermissionTypeId }, 
                permission);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create or update a role permission (upsert).
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="dto">Permission data</param>
    /// <returns>Created or updated role permission.</returns>
    [HttpPost("role/{roleId:int}/upsert")]
    [ProducesResponseType(typeof(RolePermissionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RolePermissionResponseDto>> CreateOrUpdate(int roleId, [FromBody] CreateRolePermissionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var permission = await _service.CreateOrUpdateAsync(roleId, dto);
            return Ok(permission);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing role permission.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="featureId">Feature ID</param>
    /// <param name="permissionTypeId">Permission Type ID</param>
    /// <param name="dto">Updated permission data</param>
    /// <returns>Updated role permission.</returns>
    [HttpPut("role/{roleId:int}/feature/{featureId:int}/permission/{permissionTypeId:int}")]
    [ProducesResponseType(typeof(RolePermissionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RolePermissionResponseDto>> Update(int roleId, int featureId, int permissionTypeId, [FromBody] CreateRolePermissionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _service.UpdateAsync(roleId, featureId, permissionTypeId, dto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    /// <summary>
    /// Delete a role permission.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="featureId">Feature ID</param>
    /// <param name="permissionTypeId">Permission Type ID</param>
    /// <returns>No content if successful.</returns>
    [HttpDelete("role/{roleId:int}/feature/{featureId:int}/permission/{permissionTypeId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int roleId, int featureId, int permissionTypeId)
    {
        var deleted = await _service.DeleteAsync(roleId, featureId, permissionTypeId);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Bulk update role permissions for a specific role.
    /// </summary>
    /// <param name="roleId">Role ID</param>
    /// <param name="dto">Bulk update data</param>
    /// <returns>No content if successful.</returns>
    [HttpPut("role/{roleId:int}/bulk")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateBulk(int roleId, [FromBody] BulkUpdateRolePermissionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _service.UpdateBulkAsync(roleId, dto);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Admin cập nhật permissions cho role (format đơn giản).
    /// Xóa tất cả permissions cũ và thêm lại theo danh sách mới.
    /// </summary>
    /// <param name="roleId">Role ID (ví dụ: 2 = Staff)</param>
    /// <param name="dto">Danh sách permissions mới</param>
    /// <returns>Updated permissions</returns>
    /// <example>
    /// POST /api/RolePermissions/role/2/update
    /// {
    ///   "featurePermissions": [
    ///     { "featureId": 2, "permissionTypeIds": [1, 2, 3] }, // Quản lý Sản phẩm: View, Create, Update
    ///     { "featureId": 3, "permissionTypeIds": [1, 2] }    // Quản lý Đơn hàng: View, Create
    ///   ]
    /// }
    /// </example>
    [HttpPut("role/{roleId:int}/update")]
    [HttpPost("role/{roleId:int}/update")] // Hỗ trợ cả POST và PUT
    [ProducesResponseType(typeof(RolePermissionResponseDto[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RolePermissionResponseDto[]>> UpdateRolePermissions(int roleId, [FromBody] UpdateRolePermissionsDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _service.UpdateRolePermissionsAsync(roleId, dto);
            
            // Trả về danh sách permissions sau khi cập nhật
            var updatedPermissions = await _service.GetByRoleIdAsync(roleId);
            return Ok(updatedPermissions);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
