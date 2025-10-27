using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IPromotionService
{
    Task<PromotionResponseDto> CreateAsync(CreatePromotionDto dto);
    Task<PromotionResponseDto?> GetByIdAsync(int id);
    Task<PromotionResponseDto?> GetByPromoCodeAsync(string promoCode);
    Task<PromotionResponseDto?> UpdateAsync(int id, UpdatePromotionDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<PromotionResponseDto>> SearchAsync(PromotionQueryParams query);
    Task<int> ImportAsync(IEnumerable<CreatePromotionDto> promotions);
    Task<PromotionResponseDto[]> ListAllAsync();
    Task<PromotionResponseDto[]> GetActivePromotionsAsync();
    Task<PromotionResponseDto?> ValidateAndApplyPromotionAsync(string promoCode, decimal orderAmount);
}

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _repo;
    private readonly IMapper _mapper;

    public PromotionService(IPromotionRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PromotionResponseDto> CreateAsync(CreatePromotionDto dto)
    {
        // Validate dates
        if (dto.EndDate <= dto.StartDate)
        {
            throw new ArgumentException("End date must be after start date");
        }

        // Check if promotion with same code already exists
        var existingByCode = await _repo.GetByPromoCodeAsync(dto.PromoCode);
        if (existingByCode != null)
        {
            throw new ArgumentException($"Promotion with code '{dto.PromoCode}' already exists");
        }

        // Validate discount value for percentage
        if (dto.DiscountType == "percent" && dto.DiscountValue > 100)
        {
            throw new ArgumentException("Percentage discount cannot exceed 100%");
        }

        var promotion = _mapper.Map<Promotion>(dto);
        promotion = await _repo.CreateAsync(promotion);
        return _mapper.Map<PromotionResponseDto>(promotion);
    }

    public async Task<PromotionResponseDto?> GetByIdAsync(int id)
    {
        var promotion = await _repo.GetByIdAsync(id);
        return promotion == null ? null : _mapper.Map<PromotionResponseDto>(promotion);
    }

    public async Task<PromotionResponseDto?> GetByPromoCodeAsync(string promoCode)
    {
        var promotion = await _repo.GetByPromoCodeAsync(promoCode);
        return promotion == null ? null : _mapper.Map<PromotionResponseDto>(promotion);
    }

    public async Task<PromotionResponseDto?> UpdateAsync(int id, UpdatePromotionDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        // Validate dates if both are being updated
        if (dto.StartDate.HasValue && dto.EndDate.HasValue)
        {
            if (dto.EndDate <= dto.StartDate)
            {
                throw new ArgumentException("End date must be after start date");
            }
        }
        // Validate if only end date is being updated
        else if (dto.EndDate.HasValue && existing.StartDate.HasValue)
        {
            if (dto.EndDate <= existing.StartDate)
            {
                throw new ArgumentException("End date must be after start date");
            }
        }
        // Validate if only start date is being updated
        else if (dto.StartDate.HasValue && existing.EndDate.HasValue)
        {
            if (existing.EndDate <= dto.StartDate)
            {
                throw new ArgumentException("End date must be after start date");
            }
        }

        // If promo code is being updated, check for duplicates
        if (!string.IsNullOrWhiteSpace(dto.PromoCode) && dto.PromoCode != existing.PromoCode)
        {
            var existingByCode = await _repo.GetByPromoCodeAsync(dto.PromoCode);
            if (existingByCode != null)
            {
                throw new ArgumentException($"Promotion with code '{dto.PromoCode}' already exists");
            }
        }

        // Validate discount value for percentage
        var discountType = dto.DiscountType ?? existing.DiscountType;
        var discountValue = dto.DiscountValue ?? existing.DiscountValue;
        if (discountType == "percent" && discountValue > 100)
        {
            throw new ArgumentException("Percentage discount cannot exceed 100%");
        }

        _mapper.Map(dto, existing);
        var updated = await _repo.UpdateAsync(existing);
        return _mapper.Map<PromotionResponseDto>(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

    public async Task<PagedResponse<PromotionResponseDto>> SearchAsync(PromotionQueryParams query)
    {
        var (items, total) = await _repo.SearchAsync(query);
        return new PagedResponse<PromotionResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = _mapper.Map<PromotionResponseDto[]>(items)
        };
    }

    public async Task<int> ImportAsync(IEnumerable<CreatePromotionDto> promotions)
    {
        var validPromotions = new List<Promotion>();

        foreach (var dto in promotions)
        {
            if (string.IsNullOrWhiteSpace(dto.PromoCode))
                continue;

            // Validate dates
            if (dto.EndDate <= dto.StartDate)
                continue;

            // Check for duplicates
            var existingByCode = await _repo.GetByPromoCodeAsync(dto.PromoCode);
            if (existingByCode != null)
                continue;

            // Validate discount value for percentage
            if (dto.DiscountType == "percent" && dto.DiscountValue > 100)
                continue;

            validPromotions.Add(_mapper.Map<Promotion>(dto));
        }

        if (validPromotions.Any())
        {
            // Bulk insert would be more efficient here
            foreach (var promotion in validPromotions)
            {
                await _repo.CreateAsync(promotion);
            }
        }

        return validPromotions.Count;
    }

    public async Task<PromotionResponseDto[]> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<PromotionResponseDto[]>(items);
    }

    public async Task<PromotionResponseDto[]> GetActivePromotionsAsync()
    {
        var items = await _repo.GetActivePromotionsAsync();
        return _mapper.Map<PromotionResponseDto[]>(items);
    }

    public async Task<PromotionResponseDto?> ValidateAndApplyPromotionAsync(string promoCode, decimal orderAmount)
    {
        var promotion = await _repo.GetByPromoCodeAsync(promoCode);

        if (promotion == null)
        {
            throw new ArgumentException("Promotion code not found");
        }

        var now = DateTime.Now;

        // Check if promotion is active
        if (promotion.Status != "active")
        {
            throw new ArgumentException("Promotion is not active");
        }

        // Check date range
        if (promotion.StartDate > now)
        {
            throw new ArgumentException("Promotion has not started yet");
        }

        if (promotion.EndDate < now)
        {
            throw new ArgumentException("Promotion has expired");
        }

        // Check usage limit
        if (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit)
        {
            throw new ArgumentException("Promotion usage limit has been reached");
        }

        // Check minimum order amount
        if (promotion.MinOrderAmount > 0 && orderAmount < promotion.MinOrderAmount)
        {
            throw new ArgumentException($"Minimum order amount of {promotion.MinOrderAmount:C} required");
        }

        return _mapper.Map<PromotionResponseDto>(promotion);
    }
}
