using System;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IConfigCustomerPointService
{
    Task<ConfigCustomerPointResponseDto?> GetActiveConfigAsync();
    Task<ConfigCustomerPointResponseDto> UpdateConfigAsync(UpdateConfigCustomerPointDto dto);
    Task<decimal> ConvertPointsToMoneyAsync(decimal points);
}

public class ConfigCustomerPointService : IConfigCustomerPointService
{
    private readonly IConfigCustomerPointRepository _repo;
    private readonly IMapper _mapper;

    public ConfigCustomerPointService(IConfigCustomerPointRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<ConfigCustomerPointResponseDto?> GetActiveConfigAsync()
    {
        var config = await _repo.GetActiveConfigAsync();
        return config == null ? null : _mapper.Map<ConfigCustomerPointResponseDto>(config);
    }

    public async Task<ConfigCustomerPointResponseDto> UpdateConfigAsync(UpdateConfigCustomerPointDto dto)
    {
        var config = new ConfigCustomerPoint
        {
            PointsPerUnit = dto.PointsPerUnit,
            MoneyPerUnit = dto.MoneyPerUnit,
            IsActive = true,
            UpdatedAt = DateTime.Now
        };

        var updated = await _repo.UpdateConfigAsync(config);
        return _mapper.Map<ConfigCustomerPointResponseDto>(updated);
    }

    public async Task<decimal> ConvertPointsToMoneyAsync(decimal points)
    {
        var config = await _repo.GetActiveConfigAsync();
        if (config == null)
        {
            throw new InvalidOperationException("No active loyalty configuration found");
        }

        // Calculate money value: (points / points_per_unit) * money_per_unit
        return (points / config.PointsPerUnit) * config.MoneyPerUnit;
    }
}
