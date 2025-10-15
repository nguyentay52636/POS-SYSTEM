using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface ICategoryService
{
    Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto);
    Task<CategoryResponseDto?> GetByIdAsync(int id);
    Task<CategoryResponseDto?> GetByNameAsync(string name);
    Task<CategoryResponseDto?> UpdateAsync(int id, UpdateCategoryDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<CategoryResponseDto>> SearchAsync(CategoryQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreateCategoryDto> categories);
    Task<CategoryResponseDto[]> ListAllAsync();
}

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;
    private readonly IMapper _mapper;

    public CategoryService(ICategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto)
    {
        // Check if category with same name already exists
        var existingByName = await _repo.GetByNameAsync(dto.CategoryName);
        if (existingByName != null)
        {
            throw new ArgumentException($"Category '{dto.CategoryName}' already exists");
        }

        var category = _mapper.Map<Category>(dto);
        category = await _repo.CreateAsync(category);
        return _mapper.Map<CategoryResponseDto>(category);
    }

    public async Task<CategoryResponseDto?> GetByIdAsync(int id)
    {
        var category = await _repo.GetByIdAsync(id);
        return category == null ? null : _mapper.Map<CategoryResponseDto>(category);
    }

    public async Task<CategoryResponseDto?> GetByNameAsync(string name)
    {
        var category = await _repo.GetByNameAsync(name);
        return category == null ? null : _mapper.Map<CategoryResponseDto>(category);
    }

    public async Task<CategoryResponseDto?> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // Check if another category with the same name exists
        var existingByName = await _repo.GetByNameAsync(dto.CategoryName);
        if (existingByName != null && existingByName.CategoryId != id)
        {
            throw new ArgumentException($"Category '{dto.CategoryName}' already exists");
        }

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<CategoryResponseDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        // Check if category exists
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return false;

        // Check if category has products
        var productCount = await _repo.CountProductsInCategoryAsync(id);
        if (productCount > 0)
        {
            throw new InvalidOperationException(
                $"Cannot delete category '{existing.CategoryName}' because it has {productCount} product(s). Please reassign or delete the products first.");
        }

        return await _repo.DeleteAsync(id);
    }

    public async Task<PagedResponse<CategoryResponseDto>> SearchAsync(CategoryQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<CategoryResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = _mapper.Map<CategoryResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreateCategoryDto> categories)
    {
        var validCategories = new List<Category>();

        foreach (var dto in categories)
        {
            if (string.IsNullOrWhiteSpace(dto.CategoryName))
                continue;

            // Check for duplicates
            var existingByName = await _repo.GetByNameAsync(dto.CategoryName);
            if (existingByName != null)
                continue;

            validCategories.Add(_mapper.Map<Category>(dto));
        }

        if (validCategories.Any())
        {
            // Bulk insert
            foreach (var category in validCategories)
            {
                await _repo.CreateAsync(category);
            }
        }

        return validCategories.Count;
    }

    public async Task<CategoryResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<CategoryResponseDto[]>(items);
    }
}
