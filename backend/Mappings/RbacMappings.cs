using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Enums;

namespace backend.Mappings;

public class RbacMappings : Profile
{
    public RbacMappings()
    {
        // Role Mappings
        CreateMap<Role, RoleResponseDto>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Description) ? src.Description : UserRoleHelper.GetRoleName(src.RoleId)));
        CreateMap<CreateRoleDto, Role>()
            .ForMember(dest => dest.RoleId, opt => opt.Ignore())
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.RoleName));
        CreateMap<UpdateRoleDto, Role>()
            .ForMember(dest => dest.RoleId, opt => opt.Ignore())
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.RoleName))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // Feature Mappings - moved to FeatureMappings.cs

        // PermissionType Mappings
        CreateMap<PermissionType, PermissionTypeResponseDto>();

        // RolePermission Mappings
        CreateMap<RolePermission, RolePermissionResponseDto>()
            .ForMember(dest => dest.RolePermissionId, opt => opt.MapFrom(src => 0)) // Composite key, no single ID
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
            .ForMember(dest => dest.FeatureId, opt => opt.MapFrom(src => src.FeatureId))
            .ForMember(dest => dest.FeatureName, opt => opt.MapFrom(src => src.Feature != null ? src.Feature.FeatureName : string.Empty))
            .ForMember(dest => dest.PermissionTypeId, opt => opt.MapFrom(src => src.PermissionTypeId))
            .ForMember(dest => dest.PermissionName, opt => opt.MapFrom(src => src.PermissionType != null ? src.PermissionType.PermissionName : string.Empty))
            .ForMember(dest => dest.PermissionCode, opt => opt.MapFrom(src => src.PermissionType != null ? src.PermissionType.PermissionName : string.Empty))
            .ForMember(dest => dest.IsAllowed, opt => opt.MapFrom(src => src.IsAllowed ?? false));
    }
}
