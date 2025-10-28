using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class PromotionMappings : Profile
{
    public PromotionMappings()
    {
        CreateMap<Promotion, PromotionResponseDto>();

        CreateMap<CreatePromotionDto, Promotion>()
            .ForMember(dest => dest.PromoId, opt => opt.Ignore())
            .ForMember(dest => dest.UsedCount, opt => opt.MapFrom(src => 0));

        CreateMap<UpdatePromotionDto, Promotion>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
