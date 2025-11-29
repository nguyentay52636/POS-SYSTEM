using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IPermissionTypeService
{
    Task<IReadOnlyList<PermissionTypeResponseDto>> ListAllAsync();
}

public class PermissionTypeService : IPermissionTypeService
{
    private readonly IPermissionTypeRepository _repo;
    private readonly IMapper _mapper;

    public PermissionTypeService(IPermissionTypeRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<PermissionTypeResponseDto>> ListAllAsync()
    {
        var items = await _repo.ListAllAsync();
        return _mapper.Map<IReadOnlyList<PermissionTypeResponseDto>>(items);
    }
}
