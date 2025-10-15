using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface ISupplierService
{
    Task<SupplierResponseDto> CreateAsync(CreateSupplierDto dto);
    Task<SupplierResponseDto?> GetByIdAsync(int id);
    Task<SupplierResponseDto?> GetByNameAsync(string name);
    Task<SupplierResponseDto?> GetByEmailAsync(string email);
    Task<SupplierResponseDto?> UpdateAsync(int id, UpdateSupplierDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<SupplierResponseDto>> SearchAsync(SupplierQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreateSupplierDto> suppliers);
    Task<SupplierResponseDto[]> ListAllAsync();
}

public class SupplierService : ISupplierService
{
    private readonly ISupplierRepository _repo;
    private readonly IMapper _mapper;

    public SupplierService(ISupplierRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SupplierResponseDto> CreateAsync(CreateSupplierDto dto)
    {
        // Check if supplier with same name already exists
        var existingByName = await _repo.GetByNameAsync(dto.Name);
        if (existingByName != null)
        {
            throw new ArgumentException($"Supplier with name '{dto.Name}' already exists");
        }

        // Check if supplier with same email already exists (if email is provided)
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var existingByEmail = await _repo.GetByEmailAsync(dto.Email);
            if (existingByEmail != null)
            {
                throw new ArgumentException($"Supplier with email '{dto.Email}' already exists");
            }
        }

        var supplier = _mapper.Map<Supplier>(dto);
        supplier = await _repo.CreateAsync(supplier);
        return _mapper.Map<SupplierResponseDto>(supplier);
    }

    public async Task<SupplierResponseDto?> GetByIdAsync(int id)
    {
        var supplier = await _repo.GetByIdAsync(id);
        return supplier == null ? null : _mapper.Map<SupplierResponseDto>(supplier);
    }

    public async Task<SupplierResponseDto?> GetByNameAsync(string name)
    {
        var supplier = await _repo.GetByNameAsync(name);
        return supplier == null ? null : _mapper.Map<SupplierResponseDto>(supplier);
    }

    public async Task<SupplierResponseDto?> GetByEmailAsync(string email)
    {
        var supplier = await _repo.GetByEmailAsync(email);
        return supplier == null ? null : _mapper.Map<SupplierResponseDto>(supplier);
    }

    public async Task<SupplierResponseDto?> UpdateAsync(int id, UpdateSupplierDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // If name is being updated, check for duplicates
        if (!string.IsNullOrWhiteSpace(dto.Name) && dto.Name != existing.Name)
        {
            var existingByName = await _repo.GetByNameAsync(dto.Name);
            if (existingByName != null)
            {
                throw new ArgumentException($"Supplier with name '{dto.Name}' already exists");
            }
        }

        // If email is being updated, check for duplicates
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != existing.Email)
        {
            var existingByEmail = await _repo.GetByEmailAsync(dto.Email);
            if (existingByEmail != null)
            {
                throw new ArgumentException($"Supplier with email '{dto.Email}' already exists");
            }
        }

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<SupplierResponseDto>(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

    public async Task<PagedResponse<SupplierResponseDto>> SearchAsync(SupplierQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<SupplierResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = _mapper.Map<SupplierResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateSupplierDto> suppliers)
    {
        var validSuppliers = new List<Supplier>();

        foreach (var dto in suppliers)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                continue;

            // Check for duplicates
            var existingByName = await _repo.GetByNameAsync(dto.Name);
            if (existingByName != null)
                continue;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var existingByEmail = await _repo.GetByEmailAsync(dto.Email);
                if (existingByEmail != null)
                    continue;
            }

            validSuppliers.Add(_mapper.Map<Supplier>(dto));
        }

        if (validSuppliers.Any())
        {
            // Bulk insert would be more efficient here
            foreach (var supplier in validSuppliers)
            {
                await _repo.CreateAsync(supplier);
            }
        }

        return validSuppliers.Count;
    }

    public async Task<SupplierResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<SupplierResponseDto[]>(items);
    }
}
