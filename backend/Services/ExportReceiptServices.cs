using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IExportReceiptService
{
    Task<ExportReceiptResponseDto> CreateAsync(CreateExportReceiptDto dto);
    Task<ExportReceiptDetailResponseDto?> GetByIdAsync(int id);
    Task<ExportReceiptResponseDto?> UpdateStatusAsync(int id, UpdateExportReceiptStatusDto dto);
    Task<bool> CancelExportReceiptAsync(int id);
    Task<PagedResponse<ExportReceiptResponseDto>> SearchAsync(ExportReceiptQueryParams query);
    Task<ExportReceiptResponseDto[]> ListAllAsync();
    Task<ExportItemResponseDto[]> GetExportItemsAsync(int exportId);
}

public class ExportReceiptService : IExportReceiptService
{
    private readonly IExportReceiptRepository _exportReceiptRepo;
    private readonly IProductRepository _productRepo;
    private readonly ICustomerRepository _customerRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public ExportReceiptService(
        IExportReceiptRepository exportReceiptRepo,
        IProductRepository productRepo,
        ICustomerRepository customerRepo,
        IUserRepository userRepo,
        IMapper mapper)
    {
        _exportReceiptRepo = exportReceiptRepo;
        _productRepo = productRepo;
        _customerRepo = customerRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<ExportReceiptResponseDto> CreateAsync(CreateExportReceiptDto dto)
    {
        // Validate user exists
        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {dto.UserId} not found");
        }

        // Validate customer exists
        var customer = await _customerRepo.GetByIdAsync(dto.CustomerId);
        if (customer == null)
        {
            throw new ArgumentException($"Customer with ID {dto.CustomerId} not found");
        }

        // Validate all products exist and calculate totals
        decimal totalAmount = 0;
        var exportItems = new List<ExportItem>();

        foreach (var item in dto.ExportItems)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {item.ProductId} not found");
            }

            var exportItem = _mapper.Map<ExportItem>(item);
            exportItem.Subtotal = item.UnitPrice * item.Quantity;
            exportItems.Add(exportItem);
            totalAmount += exportItem.Subtotal;
        }

        // Create export receipt
        var exportReceipt = new ExportReceipt
        {
            CustomerId = dto.CustomerId,
            UserId = dto.UserId,
            Status = dto.Status,
            Note = dto.Note,
            TotalAmount = totalAmount,
            ExportDate = DateTime.Now
        };

        var created = await _exportReceiptRepo.CreateAsync(exportReceipt);

        // Add export items
        foreach (var item in exportItems)
        {
            item.ExportId = created.ExportId;
        }
        await _exportReceiptRepo.AddExportItemsAsync(exportItems);

        return await GetExportReceiptResponseDtoAsync(created.ExportId);
    }

    public async Task<ExportReceiptDetailResponseDto?> GetByIdAsync(int id)
    {
        var exportReceipt = await _exportReceiptRepo.GetByIdAsync(id);
        if (exportReceipt == null) return null;

        var exportDto = _mapper.Map<ExportReceiptDetailResponseDto>(exportReceipt);

        // Map customer details
        if (exportReceipt.Customer != null)
        {
            exportDto.CustomerName = exportReceipt.Customer.Name;
            exportDto.CustomerEmail = exportReceipt.Customer.Email;
            exportDto.CustomerPhone = exportReceipt.Customer.Phone;
        }

        // Map user details
        if (exportReceipt.User != null)
        {
            exportDto.UserName = exportReceipt.User.Username;
        }

        // Map export items
        exportDto.ExportItems = new List<ExportItemResponseDto>();
        foreach (var item in exportReceipt.ExportItems)
        {
            var itemDto = _mapper.Map<ExportItemResponseDto>(item);
            if (item.Product != null)
            {
                itemDto.ProductName = item.Product.ProductName;
                itemDto.Barcode = item.Product.Barcode;
            }
            exportDto.ExportItems.Add(itemDto);
        }

        return exportDto;
    }

    private async Task<ExportReceiptResponseDto> GetExportReceiptResponseDtoAsync(int id)
    {
        var exportReceipt = await _exportReceiptRepo.GetByIdAsync(id);
        if (exportReceipt == null)
        {
            throw new ArgumentException($"Export receipt with ID {id} not found");
        }

        var exportDto = _mapper.Map<ExportReceiptResponseDto>(exportReceipt);

        // Map customer name
        if (exportReceipt.Customer != null)
        {
            exportDto.CustomerName = exportReceipt.Customer.Name;
        }

        // Map user name
        if (exportReceipt.User != null)
        {
            exportDto.UserName = exportReceipt.User.Username;
        }

        // Map export items
        var exportItems = await _exportReceiptRepo.GetExportItemsByExportIdAsync(id);
        exportDto.ExportItems = new List<ExportItemResponseDto>();

        foreach (var item in exportItems)
        {
            var itemDto = _mapper.Map<ExportItemResponseDto>(item);
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                itemDto.ProductName = product.ProductName;
                itemDto.Barcode = product.Barcode;
            }
            exportDto.ExportItems.Add(itemDto);
        }

        return exportDto;
    }

    public async Task<ExportReceiptResponseDto?> UpdateStatusAsync(int id, UpdateExportReceiptStatusDto dto)
    {
        var exportReceipt = await _exportReceiptRepo.GetByIdAsync(id);
        if (exportReceipt == null) return null;

        // Only allow updating status of pending export receipts
        if (exportReceipt.Status != "pending" && dto.Status != "canceled")
        {
            throw new ArgumentException("Can only update status of pending export receipts");
        }

        var success = await _exportReceiptRepo.UpdateExportReceiptStatusAsync(id, dto.Status);
        if (!success) return null;

        return await GetExportReceiptResponseDtoAsync(id);
    }

    public async Task<bool> CancelExportReceiptAsync(int id)
    {
        var exportReceipt = await _exportReceiptRepo.GetByIdAsync(id);
        if (exportReceipt == null)
        {
            throw new ArgumentException($"Export receipt with ID {id} not found");
        }

        if (exportReceipt.Status != "pending")
        {
            throw new ArgumentException("Only pending export receipts can be canceled");
        }

        return await _exportReceiptRepo.CancelExportReceiptAsync(id);
    }

    public async Task<PagedResponse<ExportReceiptResponseDto>> SearchAsync(ExportReceiptQueryParams query)
    {
        var (items, total) = await _exportReceiptRepo.SearchAsync(query);
        var exportDtos = new List<ExportReceiptResponseDto>();

        foreach (var exportReceipt in items)
        {
            var exportDto = await GetExportReceiptResponseDtoAsync(exportReceipt.ExportId);
            exportDtos.Add(exportDto);
        }

        return new PagedResponse<ExportReceiptResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = exportDtos.ToArray()
        };
    }

    public async Task<ExportReceiptResponseDto[]> ListAllAsync()
    {
        var items = await _exportReceiptRepo.ListAllAsync();
        var exportDtos = new List<ExportReceiptResponseDto>();

        foreach (var exportReceipt in items)
        {
            var exportDto = await GetExportReceiptResponseDtoAsync(exportReceipt.ExportId);
            exportDtos.Add(exportDto);
        }

        return exportDtos.ToArray();
    }

    public async Task<ExportItemResponseDto[]> GetExportItemsAsync(int exportId)
    {
        var exportReceipt = await _exportReceiptRepo.GetByIdAsync(exportId);
        if (exportReceipt == null)
        {
            throw new ArgumentException($"Export receipt with ID {exportId} not found");
        }

        var exportItems = await _exportReceiptRepo.GetExportItemsByExportIdAsync(exportId);
        var itemDtos = new List<ExportItemResponseDto>();

        foreach (var item in exportItems)
        {
            var itemDto = _mapper.Map<ExportItemResponseDto>(item);
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                itemDto.ProductName = product.ProductName;
                itemDto.Barcode = product.Barcode;
            }
            itemDtos.Add(itemDto);
        }

        return itemDtos.ToArray();
    }
}

