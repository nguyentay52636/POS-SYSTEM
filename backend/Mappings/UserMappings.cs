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
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => UserRoleHelper.GetRoleName(src.Role)));

        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src =>
                UserRoleHelper.GetRoleValue(src.Role ?? "staff")));

        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src =>
                string.IsNullOrWhiteSpace(src.Role) ? 1 : UserRoleHelper.GetRoleValue(src.Role)))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
