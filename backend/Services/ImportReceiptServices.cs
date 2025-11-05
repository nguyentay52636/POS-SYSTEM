using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface IImportReceiptService
{
    Task<ImportReceiptResponseDto> CreateAsync(CreateImportReceiptDto dto);
    Task<ImportReceiptDetailResponseDto?> GetByIdAsync(int id);
    Task<ImportReceiptResponseDto?> UpdateStatusAsync(int id, UpdateImportStatusDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<ImportReceiptResponseDto>> SearchAsync(ImportReceiptQueryParams query);
    Task<ImportReceiptResponseDto[]> ListAllAsync();
    Task<ImportItemResponseDto[]> AddItemsAsync(int importId, AddImportItemsDto dto);
    Task<ImportItemResponseDto[]> GetItemsAsync(int importId);
    Task<ImportStatsResponseDto> GetStatsAsync(DateTime? fromDate, DateTime? toDate);
}

public class ImportReceiptService : IImportReceiptService
{
    private readonly IImportReceiptRepository _importRepo;
    private readonly ISupplierRepository _supplierRepo;
    private readonly IUserRepository _userRepo;
    private readonly IProductRepository _productRepo;
    private readonly IMapper _mapper;

    public ImportReceiptService(
        IImportReceiptRepository importRepo,
        ISupplierRepository supplierRepo,
        IUserRepository userRepo,
        IProductRepository productRepo,
        IMapper mapper)
    {
        _importRepo = importRepo;
        _supplierRepo = supplierRepo;
        _userRepo = userRepo;
        _productRepo = productRepo;
        _mapper = mapper;
    }

    public async Task<ImportReceiptResponseDto> CreateAsync(CreateImportReceiptDto dto)
    {
        // Validate supplier exists
        var supplier = await _supplierRepo.GetByIdAsync(dto.SupplierId);
        if (supplier == null)
        {
            throw new ArgumentException($"Supplier with ID {dto.SupplierId} not found");
        }

        // Validate user exists
        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {dto.UserId} not found");
        }

        var importReceipt = _mapper.Map<ImportReceipt>(dto);
        var created = await _importRepo.CreateAsync(importReceipt);
        return _mapper.Map<ImportReceiptResponseDto>(created);
    }

    public async Task<ImportReceiptDetailResponseDto?> GetByIdAsync(int id)
    {
        var importReceipt = await _importRepo.GetByIdWithDetailsAsync(id);
        if (importReceipt == null) return null;

        var dto = _mapper.Map<ImportReceiptDetailResponseDto>(importReceipt);

        // Map supplier details
        if (importReceipt.Supplier != null)
        {
            dto.SupplierName = importReceipt.Supplier.Name;
            dto.SupplierEmail = importReceipt.Supplier.Email;
            dto.SupplierPhone = importReceipt.Supplier.Phone;
        }

        // Map user details
        if (importReceipt.User != null)
        {
            dto.UserName = importReceipt.User.FullName ?? importReceipt.User.Username;
        }

        // Map import items
        if (importReceipt.ImportItems != null && importReceipt.ImportItems.Any())
        {
            dto.ImportItems = importReceipt.ImportItems.Select(ii => new ImportItemResponseDto
            {
                ImportItemId = ii.ImportItemId,
                ImportId = ii.ImportId,
                ProductId = ii.ProductId,
                ProductName = ii.Product?.ProductName,
                Barcode = ii.Product?.Barcode,
                Quantity = ii.Quantity,
                UnitPrice = ii.UnitPrice,
                Subtotal = ii.Subtotal
            }).ToList();
        }

        return dto;
    }

    public async Task<ImportReceiptResponseDto?> UpdateStatusAsync(int id, UpdateImportStatusDto dto)
    {
        var updated = await _importRepo.UpdateStatusAsync(id, dto.Status);
        if (!updated) return null;

        var importReceipt = await _importRepo.GetByIdAsync(id);
        if (importReceipt == null) return null;

        return _mapper.Map<ImportReceiptResponseDto>(importReceipt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _importRepo.DeleteAsync(id);
    }

    public async Task<PagedResponse<ImportReceiptResponseDto>> SearchAsync(ImportReceiptQueryParams query)
    {
        var (items, total) = await _importRepo.SearchAsync(query);
        var dtos = items.Select(ir => _mapper.Map<ImportReceiptResponseDto>(ir)).ToList();

        // Map supplier and user names
        foreach (var dto in dtos)
        {
            var importReceipt = items.FirstOrDefault(ir => ir.ImportId == dto.ImportId);
            if (importReceipt?.Supplier != null)
            {
                dto.SupplierName = importReceipt.Supplier.Name;
            }
            if (importReceipt?.User != null)
            {
                dto.UserName = importReceipt.User.FullName ?? importReceipt.User.Username;
            }
        }

        return new PagedResponse<ImportReceiptResponseDto>
        {
            Items = dtos.ToArray(),
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<ImportReceiptResponseDto[]> ListAllAsync()
    {
        var importReceipts = await _importRepo.ListAllAsync();
        var dtos = importReceipts.Select(ir => _mapper.Map<ImportReceiptResponseDto>(ir)).ToArray();

        // Map supplier and user names
        for (int i = 0; i < dtos.Length; i++)
        {
            if (importReceipts[i].Supplier != null)
            {
                dtos[i].SupplierName = importReceipts[i].Supplier.Name;
            }
            if (importReceipts[i].User != null)
            {
                dtos[i].UserName = importReceipts[i].User.FullName ?? importReceipts[i].User.Username;
            }
        }

        return dtos;
    }

    public async Task<ImportItemResponseDto[]> AddItemsAsync(int importId, AddImportItemsDto dto)
    {
        // Validate import receipt exists
        var importReceipt = await _importRepo.GetByIdAsync(importId);
        if (importReceipt == null)
        {
            throw new ArgumentException($"Import receipt with ID {importId} not found");
        }

        if (importReceipt.Status == "completed")
        {
            throw new ArgumentException("Cannot add items to a completed import receipt");
        }

        // Validate all products exist
        var productIds = dto.Items.Select(item => item.ProductId).Distinct().ToList();
        foreach (var productId in productIds)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {productId} not found");
            }
        }

        // Create import items
        var importItems = dto.Items.Select(item => new ImportItem
        {
            ImportId = importId,
            ProductId = item.ProductId,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Subtotal = item.UnitPrice * item.Quantity
        }).ToList();

        var createdItems = await _importRepo.AddImportItemsAsync(importItems);

        // Get updated import receipt with items
        var updatedReceipt = await _importRepo.GetByIdWithDetailsAsync(importId);

        // Map to response DTOs
        return updatedReceipt?.ImportItems
            .Select(ii => new ImportItemResponseDto
            {
                ImportItemId = ii.ImportItemId,
                ImportId = ii.ImportId,
                ProductId = ii.ProductId,
                ProductName = ii.Product?.ProductName,
                Barcode = ii.Product?.Barcode,
                Quantity = ii.Quantity,
                UnitPrice = ii.UnitPrice,
                Subtotal = ii.Subtotal
            })
            .ToArray() ?? Array.Empty<ImportItemResponseDto>();
    }

    public async Task<ImportItemResponseDto[]> GetItemsAsync(int importId)
    {
        var items = await _importRepo.GetImportItemsByImportIdAsync(importId);
        return items.Select(ii => new ImportItemResponseDto
        {
            ImportItemId = ii.ImportItemId,
            ImportId = ii.ImportId,
            ProductId = ii.ProductId,
            ProductName = ii.Product?.ProductName,
            Barcode = ii.Product?.Barcode,
            Quantity = ii.Quantity,
            UnitPrice = ii.UnitPrice,
            Subtotal = ii.Subtotal
        }).ToArray();
    }

    public async Task<ImportStatsResponseDto> GetStatsAsync(DateTime? fromDate, DateTime? toDate)
    {
        return await _importRepo.GetStatsAsync(fromDate, toDate);
    }
}

