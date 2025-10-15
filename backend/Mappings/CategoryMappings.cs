using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class CategoryMappings : Profile
{
    public CategoryMappings()
    {
        CreateMap<Category, CategoryResponseDto>();

        CreateMap<CreateCategoryDto, Category>()
            .ForMember(dest => dest.CategoryId, opt => opt.Ignore());

        CreateMap<UpdateCategoryDto, Category>()
            .ForMember(dest => dest.CategoryId, opt => opt.Ignore());
    }
}
