using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class PromotionMappings : Profile
{
    public PromotionMappings()
    {
        // Map from Model to DTO (DateOnly -> DateTime)
        CreateMap<Promotion, PromotionResponseDto>()
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate.ToDateTime(TimeOnly.MinValue)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate.ToDateTime(TimeOnly.MinValue)));

        // Map from DTO to Model (DateTime -> DateOnly)
        CreateMap<CreatePromotionDto, Promotion>()
            .ForMember(dest => dest.PromoId, opt => opt.Ignore())
            .ForMember(dest => dest.UsedCount, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.StartDate)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.EndDate)));

        // Map from Update DTO to Model (DateTime? -> DateOnly)
        CreateMap<UpdatePromotionDto, Promotion>()
            .ForMember(dest => dest.PromoId, opt => opt.Ignore())
            .ForMember(dest => dest.StartDate, opt =>
            {
                opt.Condition((src, dest, srcMember) => src.StartDate.HasValue);
                opt.MapFrom(src => DateOnly.FromDateTime(src.StartDate!.Value));
            })
            .ForMember(dest => dest.EndDate, opt =>
            {
                opt.Condition((src, dest, srcMember) => src.EndDate.HasValue);
                opt.MapFrom(src => DateOnly.FromDateTime(src.EndDate!.Value));
            })
            .ForMember(dest => dest.PromoCode, opt => opt.Condition((src, dest, srcMember) => !string.IsNullOrWhiteSpace(src.PromoCode)))
            .ForMember(dest => dest.Description, opt => opt.Condition((src, dest, srcMember) => !string.IsNullOrWhiteSpace(src.Description)))
            .ForMember(dest => dest.DiscountType, opt => opt.Condition((src, dest, srcMember) => !string.IsNullOrWhiteSpace(src.DiscountType)))
            .ForMember(dest => dest.Status, opt => opt.Condition((src, dest, srcMember) => !string.IsNullOrWhiteSpace(src.Status)))
            .ForMember(dest => dest.DiscountValue, opt => opt.Condition((src, dest, srcMember) => src.DiscountValue.HasValue))
            .ForMember(dest => dest.MinOrderAmount, opt => opt.Condition((src, dest, srcMember) => src.MinOrderAmount.HasValue))
            .ForMember(dest => dest.UsageLimit, opt => opt.Condition((src, dest, srcMember) => src.UsageLimit.HasValue))
            .ForMember(dest => dest.UsedCount, opt => opt.Condition((src, dest, srcMember) => src.UsedCount.HasValue));
    }
}
