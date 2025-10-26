    using AutoMapper;
    using backend.DTOs;
    using backend.Models;

    namespace backend.Mappings;

    public class InventoryMappings : Profile
    {
        public InventoryMappings()
        {
            CreateMap<Inventory, InventoryResponseDto>()
                .ForMember(dest => dest.ProductName, opt => opt.Ignore());

            CreateMap<UpdateInventoryDto, Inventory>()
                .ForMember(dest => dest.InventoryId, opt => opt.Ignore())
                .ForMember(dest => dest.ProductId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            CreateMap<CreateInventoryDto, Inventory>()
            .ForMember(dest => dest.InventoryId, opt => opt.Ignore()) // tự tăng trong DB
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());  // hệ thống sẽ tự cập nhật
            CreateMap<Inventory, InventoryResponseDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName));


        }

        
    }
