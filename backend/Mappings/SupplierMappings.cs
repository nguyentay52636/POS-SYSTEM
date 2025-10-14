using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class SupplierMappings : Profile
{
    public SupplierMappings()
    {
        CreateMap<Supplier, SupplierResponseDto>();

        CreateMap<CreateSupplierDto, Supplier>()
            .ForMember(dest => dest.SupplierId, opt => opt.Ignore());

        CreateMap<UpdateSupplierDto, Supplier>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
