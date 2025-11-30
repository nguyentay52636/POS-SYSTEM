using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IFeatureService
{
    Task<FeatureResponseDto> CreateAsync(CreateFeatureDto dto);
    Task<FeatureResponseDto?> GetByIdAsync(int id);
    Task<FeatureResponseDto?> GetByNameAsync(string name);
    Task<FeatureResponseDto?> UpdateAsync(int id, UpdateFeatureDto dto);
    Task<bool> DeleteAsync(int id);
    Task<FeatureResponseDto[]> ListAllAsync();
}

public class FeatureService : IFeatureService
{
    private readonly IFeatureRepository _repo;
    private readonly IMapper _mapper;

    public FeatureService(IFeatureRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<FeatureResponseDto> CreateAsync(CreateFeatureDto dto)
    {
        // Check if feature with same name already exists
        var existingByName = await _repo.GetByNameAsync(dto.FeatureName);
        if (existingByName != null)
        {
            throw new ArgumentException($"Feature '{dto.FeatureName}' already exists");
        }

        var feature = _mapper.Map<Feature>(dto);
        feature = await _repo.CreateAsync(feature);
        return _mapper.Map<FeatureResponseDto>(feature);
    }

    public async Task<FeatureResponseDto?> GetByIdAsync(int id)
    {
        var feature = await _repo.GetByIdAsync(id);
        return feature == null ? null : _mapper.Map<FeatureResponseDto>(feature);
    }

    public async Task<FeatureResponseDto?> GetByNameAsync(string name)
    {
        var feature = await _repo.GetByNameAsync(name);
        return feature == null ? null : _mapper.Map<FeatureResponseDto>(feature);
    }

    public async Task<FeatureResponseDto?> UpdateAsync(int id, UpdateFeatureDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // Check if another feature with same name already exists
        var existingByName = await _repo.GetByNameAsync(dto.FeatureName);
        if (existingByName != null && existingByName.FeatureId != id)
        {
            throw new ArgumentException($"Feature '{dto.FeatureName}' already exists");
        }

        existing.FeatureName = dto.FeatureName;
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<FeatureResponseDto>(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

    public async Task<FeatureResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<FeatureResponseDto[]>(items);
    }
}
