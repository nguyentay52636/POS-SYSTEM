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
    Task<InventoryResponseDto?> UpdateAsync(int inventoryId, UpdateInventoryDto dto);
    Task<InventoryResponseDto?> UpdateStatusAsync(int productId, string status);
    Task<InventoryResponseDto?> CreateAsync(CreateInventoryDto dto);
    Task<bool> DeleteAsync(int productId);
}

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repo;
    private readonly IMapper _mapper;
    private readonly IProductInventoryStatusSyncService _syncService;

    public InventoryService(IInventoryRepository repo, IMapper mapper, IProductInventoryStatusSyncService syncService)
    {
        _repo = repo;
        _mapper = mapper;
        _syncService = syncService;
    }

    public async Task<InventoryResponseDto[]> ListAllAsync()
    {
        var inventories = await _repo.ListAllAsync();
        var result = _mapper.Map<InventoryResponseDto[]>(inventories);
        return result;
    }

    public async Task<InventoryResponseDto?> GetByProductIdAsync(int productId)
    {
        var inventory = await _repo.GetByProductIdAsync(productId);
        return inventory == null ? null : _mapper.Map<InventoryResponseDto>(inventory);
    }

    public async Task<InventoryResponseDto?> UpdateAsync(int inventoryId, UpdateInventoryDto dto)
    {
        var existing = await _repo.GetByIdAsync(inventoryId);
        if (existing == null)
        {
            throw new ArgumentException($"Inventory with ID {inventoryId} does not exist");
        }

        if (existing.ProductId != dto.ProductId)
        {
            throw new ArgumentException($"Product ID mismatch. Expected {existing.ProductId}, got {dto.ProductId}");
        }

        // Update quantity
        existing.Quantity = dto.Quantity;
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<InventoryResponseDto>(updated);
    }
    
    public async Task<InventoryResponseDto?> CreateAsync(CreateInventoryDto dto)
    {
        // Validate product exists
        if (!await _repo.ProductExistsAsync(dto.ProductId))
        {
            throw new ArgumentException($"Product with ID {dto.ProductId} does not exist");
        }
        var existing = await _repo.GetByProductIdAsync(dto.ProductId);
        if (existing != null)
        {
            throw new ArgumentException($"Inventory record for product ID {dto.ProductId} already exists");
        }
        // Create new inventory record
        var newInventory = _mapper.Map<Inventory>(dto);
        var created = await _repo.CreateAsync(newInventory);
        var resultDto = await GetByProductIdAsync(created.ProductId);
        return resultDto;
    }
    
    public async Task<InventoryResponseDto?> UpdateStatusAsync(int productId, string status)
    {
        var inventory = await _repo.GetByProductIdAsync(productId);
        if (inventory == null) return null;

        inventory.Status = status;
        var updated = await _repo.UpdateAsync(inventory);
        
        // Sync to Product
        await _syncService.SyncInventoryToProductAsync(productId, status);
        
        return _mapper.Map<InventoryResponseDto>(updated);
    }
    
    public async Task<bool> DeleteAsync(int productId)
    {
        var existing = await _repo.GetByProductIdAsync(productId);
        if (existing == null)
        {
            return false;
        }
        
        await _repo.DeleteAsync(existing.InventoryId);
        
        // Sync to Product: Inventory unavailable → Product inactive
        await _syncService.SyncInventoryToProductAsync(productId, "unavailable");
        
        return true;
    }
}
