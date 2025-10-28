using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class OrderMappings : Profile
{
    public OrderMappings()
    {
        CreateMap<Order, OrderResponseDto>();
        CreateMap<Order, OrderDetailResponseDto>();

        CreateMap<CreateOrderDto, Order>()
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.DiscountAmount, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => 0));

        CreateMap<OrderItem, OrderItemResponseDto>();

        CreateMap<CreateOrderItemDto, OrderItem>()
            .ForMember(dest => dest.OrderItemId, opt => opt.Ignore())
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.Price * src.Quantity));

        CreateMap<Payment, PaymentResponseDto>();
    }
}
