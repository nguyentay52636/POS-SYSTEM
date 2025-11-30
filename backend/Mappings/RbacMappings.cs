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
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => UserRoleHelper.GetRoleName(src.RoleId)));
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
            .ForMember(dest => dest.FeatureName, opt => opt.MapFrom(src => src.Feature.FeatureName))
            .ForMember(dest => dest.PermissionName, opt => opt.MapFrom(src => src.PermissionType.PermissionName))
            .ForMember(dest => dest.PermissionCode, opt => opt.MapFrom(src => src.PermissionType.PermissionName));
    }
}
