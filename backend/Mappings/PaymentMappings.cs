using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class PaymentMappings : Profile
{
    public PaymentMappings()
    {
        CreateMap<Payment, PaymentResponseDto>()
            .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order));
        CreateMap<Payment, PaymentDetailResponseDto>()
            .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order));

        CreateMap<CreatePaymentDto, Payment>()
            .ForMember(dest => dest.PaymentId, opt => opt.Ignore())
            .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => DateTime.Now));

        CreateMap<UpdatePaymentDto, Payment>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
