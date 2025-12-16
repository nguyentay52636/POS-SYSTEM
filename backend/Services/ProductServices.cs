using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IProductService
{
    Task<ProductResponseDto> CreateAsync(CreateProductDto dto);
    Task<ProductResponseDto?> GetByIdAsync(int id);
    Task<ProductResponseDto?> GetByBarcodeAsync(string barcode);
    Task<ProductResponseDto?> UpdateAsync(int id, UpdateProductDto dto);
    Task<ProductResponseDto?> UpdateStatusAsync(int id, string status);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<ProductResponseDto>> SearchAsync(ProductQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreateProductDto> products);
    Task<ProductResponseDto[]> ListAllAsync();
    Task<ProductResponseDto[]> GetBySupplierIdAsync(int supplierId);
    Task<ProductResponseDto?> ToggleStatusAsync(int id);
}

public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;
    private readonly IProductInventoryStatusSyncService _syncService;

    public ProductService(IProductRepository repo, IMapper mapper, IProductInventoryStatusSyncService syncService)
    {
        _repo = repo;
        _mapper = mapper;
        _syncService = syncService;
    }

    public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
    {
        // Validate category exists
        if (!await _repo.CategoryExistsAsync(dto.CategoryId))
        {
            throw new ArgumentException($"Category with ID {dto.CategoryId} does not exist");
        }

        // Validate supplier exists
        if (!await _repo.SupplierExistsAsync(dto.SupplierId))
        {
            throw new ArgumentException($"Supplier with ID {dto.SupplierId} does not exist");
        }

        // Check if barcode already exists (if provided)
        if (!string.IsNullOrWhiteSpace(dto.Barcode))
        {
            var existingByBarcode = await _repo.GetByBarcodeAsync(dto.Barcode);
            if (existingByBarcode != null)
            {
                throw new ArgumentException($"Product with barcode '{dto.Barcode}' already exists");
            }
        }

        var product = _mapper.Map<Product>(dto);
        product.Status = product.Status ?? "active";
        product = await _repo.CreateAsync(product);
        return _mapper.Map<ProductResponseDto>(product);
    }

    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        return product == null ? null : _mapper.Map<ProductResponseDto>(product);
    }

    public async Task<ProductResponseDto?> GetByBarcodeAsync(string barcode)
    {
        var product = await _repo.GetByBarcodeAsync(barcode);
        return product == null ? null : _mapper.Map<ProductResponseDto>(product);
    }

    public async Task<ProductResponseDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // Validate category exists
        if (!await _repo.CategoryExistsAsync(dto.CategoryId))
        {
            throw new ArgumentException($"Category with ID {dto.CategoryId} does not exist");
        }

        // Validate supplier exists
        if (!await _repo.SupplierExistsAsync(dto.SupplierId))
        {
            throw new ArgumentException($"Supplier with ID {dto.SupplierId} does not exist");
        }

        // Check if barcode already exists (if provided and different from current)
        if (!string.IsNullOrWhiteSpace(dto.Barcode) && dto.Barcode != existing.Barcode)
        {
            var existingByBarcode = await _repo.GetByBarcodeAsync(dto.Barcode);
            if (existingByBarcode != null && existingByBarcode.ProductId != id)
            {
                throw new ArgumentException($"Product with barcode '{dto.Barcode}' already exists");
            }
        }

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<ProductResponseDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return false;

        var result = await _repo.DeleteAsync(id);
        
        // Sync to Inventory: Product inactive → Inventory unavailable
        if (result)
        {
            await _syncService.SyncProductToInventoryAsync(id, "inactive");
        }
        
        return result;
    }

    public async Task<PagedResponse<ProductResponseDto>> SearchAsync(ProductQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<ProductResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = _mapper.Map<ProductResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateProductDto> products)
    {
        var validProducts = new List<Product>();

        foreach (var dto in products)
        {
            if (string.IsNullOrWhiteSpace(dto.ProductName))
                continue;

            // Validate category exists
            if (!await _repo.CategoryExistsAsync(dto.CategoryId))
                continue;

            // Validate supplier exists
            if (!await _repo.SupplierExistsAsync(dto.SupplierId))
                continue;

            // Check for duplicate barcode
            if (!string.IsNullOrWhiteSpace(dto.Barcode))
            {
                var existingByBarcode = await _repo.GetByBarcodeAsync(dto.Barcode);
                if (existingByBarcode != null)
                    continue;
            }

            validProducts.Add(_mapper.Map<Product>(dto));
        }

        if (validProducts.Any())
        {
            // Bulk insert
            foreach (var product in validProducts)
            {
                await _repo.CreateAsync(product);
            }
        }

        return validProducts.Count;
    }

    public async Task<ProductResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<ProductResponseDto[]>(items);
    }

    public async Task<ProductResponseDto[]> GetBySupplierIdAsync(int supplierId)
    {
        var items = await _repo.GetBySupplierIdAsync(supplierId);
        return _mapper.Map<ProductResponseDto[]>(items);
    }

    public async Task<ProductResponseDto?> UpdateStatusAsync(int id, string status)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product == null) return null;

        product.Status = status;
        var updated = await _repo.UpdateAsync(product);
        
        // Sync to Inventory
        await _syncService.SyncProductToInventoryAsync(id, status);
        
        return _mapper.Map<ProductResponseDto>(updated);
    }

    public async Task<ProductResponseDto?> ToggleStatusAsync(int id)
    {
        var updated = await _repo.ToggleStatusAsync(id);
        if (updated == null) return null;
        
        // Sync to Inventory
        await _syncService.SyncProductToInventoryAsync(id, updated.Status ?? "inactive");
        
        return _mapper.Map<ProductResponseDto>(updated);
    }
}
