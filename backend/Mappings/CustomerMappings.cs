using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class CustomerMappings : Profile
{
    public CustomerMappings()
    {
        CreateMap<Customer, CustomerResponseDto>();

        CreateMap<CreateCustomerDto, Customer>()
            .ForMember(dest => dest.CustomerId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        CreateMap<UpdateCustomerDto, Customer>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
