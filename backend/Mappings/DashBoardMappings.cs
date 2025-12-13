using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

/// <summary>
/// AutoMapper profile for Dashboard DTOs
/// Note: Most dashboard DTOs are created directly in repository/service
/// This profile is for any future mapping needs
/// </summary>
public class DashBoardMappings : Profile
{
    public DashBoardMappings()
    {
        // Product to TopProductDto mapping (if needed for future use)
        CreateMap<Product, TopProductDto>()
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
            .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Barcode))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null))
            .ForMember(dest => dest.TotalQuantitySold, opt => opt.Ignore())
            .ForMember(dest => dest.TotalRevenue, opt => opt.Ignore())
            .ForMember(dest => dest.GrowthRate, opt => opt.Ignore())
            .ForMember(dest => dest.Rank, opt => opt.Ignore());

        // Category to CategoryRevenueDto mapping (if needed for future use)
        CreateMap<Category, CategoryRevenueDto>()
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.CategoryName))
            .ForMember(dest => dest.Revenue, opt => opt.Ignore())
            .ForMember(dest => dest.Percentage, opt => opt.Ignore())
            .ForMember(dest => dest.Color, opt => opt.Ignore());
    }
}

