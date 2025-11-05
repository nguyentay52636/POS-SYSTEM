using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class ImportReceiptMappings : Profile
{
    public ImportReceiptMappings()
    {
        CreateMap<ImportReceipt, ImportReceiptResponseDto>()
            .ForMember(dest => dest.SupplierName, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier))
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.ImportItems, opt => opt.Ignore());

        CreateMap<ImportReceipt, ImportReceiptDetailResponseDto>()
            .ForMember(dest => dest.SupplierName, opt => opt.Ignore())
            .ForMember(dest => dest.SupplierEmail, opt => opt.Ignore())
            .ForMember(dest => dest.SupplierPhone, opt => opt.Ignore())
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.ImportItems, opt => opt.Ignore());

        CreateMap<CreateImportReceiptDto, ImportReceipt>()
            .ForMember(dest => dest.ImportId, opt => opt.Ignore())
            .ForMember(dest => dest.ImportDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status ?? "pending"))
            .ForMember(dest => dest.ImportItems, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());

        CreateMap<ImportItem, ImportItemResponseDto>()
            .ForMember(dest => dest.ProductName, opt => opt.Ignore())
            .ForMember(dest => dest.Barcode, opt => opt.Ignore());

        CreateMap<CreateImportItemDto, ImportItem>()
            .ForMember(dest => dest.ImportItemId, opt => opt.Ignore())
            .ForMember(dest => dest.ImportId, opt => opt.Ignore())
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.UnitPrice * src.Quantity))
            .ForMember(dest => dest.Import, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore());
    }
}

