using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IInventoryService
{
    Task<InventoryResponseDto[]> ListAllAsync();
    Task<InventoryResponseDto?> GetByProductIdAsync(int productId);
    Task<InventoryResponseDto?> UpdateAsync(int productId, UpdateInventoryDto dto);
    Task<InventoryResponseDto> CreateAsync(CreateInventoryDto dto);
    Task<bool> DeleteAsync(int productId);
}

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repo;
    private readonly IMapper _mapper;

    public InventoryService(IInventoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<InventoryResponseDto[]> ListAllAsync()
    {
        var inventories = await _repo.ListAllAsync();
        return _mapper.Map<InventoryResponseDto[]>(inventories);
    }

    public async Task<InventoryResponseDto?> GetByProductIdAsync(int productId)
    {
        var inventory = await _repo.GetByProductIdAsync(productId);
        return inventory == null ? null : _mapper.Map<InventoryResponseDto>(inventory);
    }

    public async Task<InventoryResponseDto?> UpdateAsync(int productId, UpdateInventoryDto dto)
    {
        // Validate product exists
        if (!await _repo.ProductExistsAsync(productId))
        {
            throw new ArgumentException($"Product with ID {productId} does not exist");
        }

        // Get existing inventory record
        var existing = await _repo.GetByProductIdAsync(productId);
        if (existing == null)
        {
            throw new ArgumentException($"Inventory record for product ID {productId} does not exist");
        }

        // Update quantity
        existing.Quantity = dto.Quantity;
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<InventoryResponseDto>(updated);
    }
/// <summary>
    /// Tạo một bản ghi tồn kho mới
    /// </summary>
    public async Task<InventoryResponseDto> CreateAsync(CreateInventoryDto dto)
    {
        // 1. Validate: Sản phẩm có tồn tại không?
        if (!await _repo.ProductExistsAsync(dto.ProductId))
        {
            throw new ArgumentException($"Product with ID {dto.ProductId} does not exist. Cannot create inventory.");
        }

        // 2. Validate: Bản ghi tồn kho cho sản phẩm này đã tồn tại chưa?
        var existing = await _repo.GetByProductIdAsync(dto.ProductId);
        if (existing != null)
        {
            throw new ArgumentException($"Inventory record for product ID {dto.ProductId} already exists.");
        }

        // 3. Map DTO sang Model (Entity)
        // (Bạn sẽ cần cấu hình AutoMapper cho việc này)
        var newInventory = _mapper.Map<Inventory>(dto); 

        // 4. Gọi Repository để thêm vào DB
        var createdInventory = await _repo.CreateAsync(newInventory);

        // 5. Map kết quả trả về (đã có InventoryId,...) sang Response DTO
        // (Chúng ta cần re-map để lấy được ProductName nếu có)
        // Cách tốt nhất là gọi lại hàm Get
        var resultDto = await GetByProductIdAsync(createdInventory.ProductId);
        
        return resultDto!; // Chúng ta biết chắc là nó tồn tại
    }

    /// <summary>
    /// Xóa một bản ghi tồn kho dựa trên ProductId
    /// </summary>
    public async Task<bool> DeleteAsync(int productId)
    {
        // 1. Tìm bản ghi tồn kho
        var existing = await _repo.GetByProductIdAsync(productId);

        // 2. Nếu không tìm thấy, trả về false (để Controller trả 404)
        if (existing == null)
        {
            return false;
        }

        // 3. Gọi Repository để xóa
        // Lưu ý: Hàm Delete của repo thường nhận Primary Key (InventoryId)
        await _repo.DeleteAsync(existing.InventoryId);

        // 4. Trả về true (để Controller trả 204 No Content)
        return true;
    }
}
