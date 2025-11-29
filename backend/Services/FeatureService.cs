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
    Task<IReadOnlyList<FeatureResponseDto>> ListAllAsync();
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
        var feature = _mapper.Map<Feature>(dto);
        feature = await _repo.CreateAsync(feature);
        return _mapper.Map<FeatureResponseDto>(feature);
    }

    public async Task<IReadOnlyList<FeatureResponseDto>> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<IReadOnlyList<FeatureResponseDto>>(items);
    }
}
