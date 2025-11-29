using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Enums;

namespace backend.Mappings;

public class UserMappings : Profile
{
    public UserMappings()
    {
        CreateMap<User, UserResponseDto>()
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.RoleId))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => UserRoleHelper.GetRoleName(src.RoleId)));

        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src =>
                UserRoleHelper.GetRoleValue(src.Role ?? "staff")));

        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Username, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src =>
                string.IsNullOrWhiteSpace(src.Role) ? (int?)null : UserRoleHelper.GetRoleValue(src.Role)))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
