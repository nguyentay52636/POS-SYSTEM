using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class ExportReceiptMappings : Profile
{
    public ExportReceiptMappings()
    {
        CreateMap<ExportReceipt, ExportReceiptResponseDto>();
        CreateMap<ExportReceipt, ExportReceiptDetailResponseDto>();

        CreateMap<CreateExportReceiptDto, ExportReceipt>()
            .ForMember(dest => dest.ExportId, opt => opt.Ignore())
            .ForMember(dest => dest.ExportDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
            .ForMember(dest => dest.ExportItems, opt => opt.Ignore());

        CreateMap<ExportItem, ExportItemResponseDto>();

        CreateMap<CreateExportItemDto, ExportItem>()
            .ForMember(dest => dest.ExportItemId, opt => opt.Ignore())
            .ForMember(dest => dest.ExportId, opt => opt.Ignore())
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.UnitPrice * src.Quantity));
    }
}

