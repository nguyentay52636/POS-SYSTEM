using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Product management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Products")]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    /// <summary>
    /// List all products (simple, no pagination).
    /// </summary>
    /// <returns>Array of products.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ProductResponseDto[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProductResponseDto[]>> List()
    {
        var result = await _service.ListAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get a product by id.
    /// </summary>
    /// <param name="id">Product id</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponseDto>> GetById(int id)
    {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    /// <summary>
    /// Get a product by barcode.
    /// </summary>
    /// <param name="barcode">Product barcode</param>
    [HttpGet("by-barcode/{barcode}")]
    [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponseDto>> GetByBarcode(string barcode)
    {
        var product = await _service.GetByBarcodeAsync(barcode);
        if (product == null) return NotFound();
        return Ok(product);
    }

    /// <summary>
    /// Search products with pagination and filtering.
    /// </summary>
    /// <remarks>
    /// Supports filtering by:
    /// - Keyword (searches in product name and barcode)
    /// - Product name
    /// - Barcode
    /// - Category ID
    /// - Supplier ID
    /// - Price range (MinPrice and MaxPrice)
    ///
    /// Supports sorting by: name, price, created, id
    /// </remarks>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResponse<ProductResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<ProductResponseDto>>> Search([FromQuery] ProductQueryParams query)
    {
        var result = await _service.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new product.
    /// </summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/product
    ///     {
    ///         "productName": "Laptop Dell XPS 15",
    ///         "barcode": "1234567890123",
    ///         "price": 1299.99,
    ///         "unit": "pcs",
    ///         "categoryId": 1,
    ///         "supplierId": 2
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductResponseDto>> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ProductId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing product.
    /// </summary>
    /// <param name="id">Product id to update</param>
    /// <param name="dto">Updated product data</param>
    /// <remarks>
    /// Sample request:
    ///
    ///     PUT /api/product/1
    ///     {
    ///         "productName": "Laptop Dell XPS 15 (Updated)",
    ///         "barcode": "1234567890123",
    ///         "price": 1399.99,
    ///         "unit": "pcs",
    ///         "categoryId": 1,
    ///         "supplierId": 2
    ///     }
    /// </remarks>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductResponseDto>> Update(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a product by id.
    /// </summary>
    /// <param name="id">Product id to delete</param>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Bulk import products from a JSON array.
    /// </summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/product/import-json
    ///     [
    ///         {
    ///             "productName": "Laptop Dell XPS 15",
    ///             "barcode": "1234567890123",
    ///             "price": 1299.99,
    ///             "unit": "pcs",
    ///             "categoryId": 1,
    ///             "supplierId": 2
    ///         },
    ///         {
    ///             "productName": "Mouse Logitech MX Master",
    ///             "barcode": "9876543210987",
    ///             "price": 99.99,
    ///             "unit": "pcs",
    ///             "categoryId": 1,
    ///             "supplierId": 2
    ///         }
    ///     ]
    ///
    /// Note: Invalid products (duplicate barcodes, non-existent categories/suppliers) will be skipped.
    /// </remarks>
    [HttpPost("import-json")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ImportJson([FromBody] IEnumerable<CreateProductDto> products)
    {
        var count = await _service.ImportAsync(products);
        return Ok(new { inserted = count });
    }
}
