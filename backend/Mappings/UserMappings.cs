using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class UserMappings : Profile
{
    public UserMappings()
    {
        CreateMap<User, UserResponseDto>();
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src =>
                string.IsNullOrWhiteSpace(src.Role) ? "staff" : src.Role));

        CreateMap<UpdateUserDto, User>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                srcMember != null && !string.IsNullOrWhiteSpace(srcMember.ToString())));
    }
}
