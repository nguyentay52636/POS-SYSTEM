using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Inventory management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all inventory records.
    /// </summary>
    /// <returns>Array of inventory records.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(InventoryResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<InventoryResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get inventory by product ID.
    /// </summary>
    /// <param name="productId">Product ID</param>
    [HttpGet("{productId:int}")]
    [ProducesResponseType(typeof(InventoryResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InventoryResponseDto>> GetByProductId(int productId)
    {
        var inventory = await _service.GetByProductIdAsync(productId);
        if (inventory == null) return NotFound();
        return Ok(inventory);
    }

    /// <summary>
    /// Update inventory quantity for a product (stock in/out).
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="dto">Updated quantity data</param>
    /// <remarks>
    /// Sample request:
    ///
    ///     PUT /api/inventory/1
    ///     {
    ///         "quantity": 150
    ///     }
    /// </remarks>
    [HttpPut("{productId:int}")]
    [ProducesResponseType(typeof(InventoryResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InventoryResponseDto>> Update(int productId, [FromBody] UpdateInventoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateAsync(productId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    /// <summary>
    /// Thêm một bản ghi tồn kho mới cho sản phẩm.
    /// </summary>
    /// <param name="dto">Dữ liệu cho bản ghi tồn kho mới.</param>
    /// <returns>Bản ghi tồn kho vừa được tạo.</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/inventory
    ///     {
    ///         "productId": 123,
    ///         "quantity": 50
    ///     }
    ///
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(InventoryResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InventoryResponseDto>> Create([FromBody] CreateInventoryDto dto)
    {
        // 1. Kiểm tra xem dữ liệu client gửi lên có hợp lệ không
        // (ví dụ: thiếu trường, sai kiểu dữ liệu)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // 2. Gọi service để tạo mới
            var newInventory = await _service.CreateAsync(dto);
            
            // 3. Trả về 201 Created (chuẩn cho POST)
            // Kèm theo một link (Location header) tới tài nguyên vừa tạo
            // và nội dung của tài nguyên đó.
            return CreatedAtAction(
                nameof(GetByProductId), // Tên của hàm GET
                new { productId = newInventory!.ProductId }, // Tham số cho hàm GET
                newInventory); // Dữ liệu trả về
        }
        catch (ArgumentException ex) // Bắt lỗi nghiệp vụ (ví dụ: ProductId đã tồn tại)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Xóa một bản ghi tồn kho.
    /// </summary>
    /// <param name="productId">Product ID cần xóa</param>
    /// <returns>Không có nội dung nếu xóa thành công.</returns>
    [HttpDelete("{productId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int productId)
    {
        // 1. Gọi service để xóa
        // Giả sử DeleteAsync trả về 'true' nếu xóa thành công
        // và 'false' nếu không tìm thấy (NotFound)
        var success = await _service.DeleteAsync(productId);

        // 2. Nếu không thành công (không tìm thấy)
        if (!success)
        {
            return NotFound();
        }

        // 3. Trả về 204 No Content (chuẩn cho DELETE thành công)
        // Báo cho client biết đã xóa OK, không cần gửi kèm nội dung
        return NoContent();
    }
}
