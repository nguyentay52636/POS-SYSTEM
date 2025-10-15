using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface ICustomerService
{
    Task<CustomerResponseDto> CreateAsync(CreateCustomerDto dto);
    Task<CustomerResponseDto?> GetByIdAsync(int id);
    Task<CustomerResponseDto?> GetByNameAsync(string name);
    Task<CustomerResponseDto?> GetByEmailAsync(string email);
    Task<CustomerResponseDto?> UpdateAsync(int id, UpdateCustomerDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<CustomerResponseDto>> SearchAsync(CustomerQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreateCustomerDto> customers);
    Task<CustomerResponseDto[]> ListAllAsync();
}

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _repo;
    private readonly IMapper _mapper;

    public CustomerService(ICustomerRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CustomerResponseDto> CreateAsync(CreateCustomerDto dto)
    {
        // Check if customer with same name already exists
        var existingByName = await _repo.GetByNameAsync(dto.Name);
        if (existingByName != null)
        {
            throw new ArgumentException($"Customer with name '{dto.Name}' already exists");
        }

        // Check if customer with same email already exists (if email is provided)
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var existingByEmail = await _repo.GetByEmailAsync(dto.Email);
            if (existingByEmail != null)
            {
                throw new ArgumentException($"Customer with email '{dto.Email}' already exists");
            }
        }

        var customer = _mapper.Map<Customer>(dto);
        customer = await _repo.CreateAsync(customer);
        return _mapper.Map<CustomerResponseDto>(customer);
    }

    public async Task<CustomerResponseDto?> GetByIdAsync(int id)
    {
        var customer = await _repo.GetByIdAsync(id);
        return customer == null ? null : _mapper.Map<CustomerResponseDto>(customer);
    }

    public async Task<CustomerResponseDto?> GetByNameAsync(string name)
    {
        var customer = await _repo.GetByNameAsync(name);
        return customer == null ? null : _mapper.Map<CustomerResponseDto>(customer);
    }

    public async Task<CustomerResponseDto?> GetByEmailAsync(string email)
    {
        var customer = await _repo.GetByEmailAsync(email);
        return customer == null ? null : _mapper.Map<CustomerResponseDto>(customer);
    }

    public async Task<CustomerResponseDto?> UpdateAsync(int id, UpdateCustomerDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // If name is being updated, check for duplicates
        if (!string.IsNullOrWhiteSpace(dto.Name) && dto.Name != existing.Name)
        {
            var existingByName = await _repo.GetByNameAsync(dto.Name);
            if (existingByName != null)
            {
                throw new ArgumentException($"Customer with name '{dto.Name}' already exists");
            }
        }

        // If email is being updated, check for duplicates
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != existing.Email)
        {
            var existingByEmail = await _repo.GetByEmailAsync(dto.Email);
            if (existingByEmail != null)
            {
                throw new ArgumentException($"Customer with email '{dto.Email}' already exists");
            }
        }

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<CustomerResponseDto>(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

    public async Task<PagedResponse<CustomerResponseDto>> SearchAsync(CustomerQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<CustomerResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = _mapper.Map<CustomerResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateCustomerDto> customers)
    {
        var validCustomers = new List<Customer>();

        foreach (var dto in customers)
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

            validCustomers.Add(_mapper.Map<Customer>(dto));
        }

        if (validCustomers.Any())
        {
            // Bulk insert would be more efficient here
            foreach (var customer in validCustomers)
            {
                await _repo.CreateAsync(customer);
            }
        }

        return validCustomers.Count;
    }

    public async Task<CustomerResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<CustomerResponseDto[]>(items);
    }
}
