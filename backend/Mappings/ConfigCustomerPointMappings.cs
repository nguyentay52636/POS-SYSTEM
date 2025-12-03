using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class ConfigCustomerPointMappings : Profile
{
    public ConfigCustomerPointMappings()
    {
        CreateMap<ConfigCustomerPoint, ConfigCustomerPointResponseDto>();
        CreateMap<UpdateConfigCustomerPointDto, ConfigCustomerPoint>();
    }
}
