using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class FeatureMappings : Profile
{
    public FeatureMappings()
    {
        CreateMap<Feature, FeatureResponseDto>();
        CreateMap<CreateFeatureDto, Feature>()
            .ForMember(dest => dest.FeatureId, opt => opt.Ignore());
        CreateMap<UpdateFeatureDto, Feature>()
            .ForMember(dest => dest.FeatureId, opt => opt.Ignore());
    }
}

