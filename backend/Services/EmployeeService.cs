using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.DTOs;
using backend.Repositories;

namespace backend.Services;

public interface IEmployeeService
{
    Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto);
    Task<EmployeeDTO?> GetByIdAsync(int id);
    Task<EmployeeDTO> UpdateAsync(int id, UpdateEmployeeDTO dto);
    Task<bool> DeleteAsync(int id);
    Task<IReadOnlyList<EmployeeDTO>> ListAllAsync(string? status = null);
    Task<IReadOnlyList<EmployeeDTO>> ListAllAsync();
    Task<EmployeeDTO> ToggleStatusAsync(int id);
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;

    public EmployeeService(IEmployeeRepository repo)
    {
        _repo = repo;
    }

    public async Task<EmployeeDTO> ToggleStatusAsync(int id)
    {
        var employee = await _repo.GetByIdAsync(id);
        if (employee == null)
            throw new KeyNotFoundException($"Employee with ID {id} not found");

        employee.Status = employee.Status == "active" ? "inactive" : "active";

        var updated = await _repo.UpdateAsync(employee);
        return MapToDTO(updated);
    }

    public async Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto)
    {
        var employee = new Employee
        {
            FullName = dto.FullName,
            Gender = dto.Gender,
            BirthDate = dto.BirthDate,
            Phone = dto.Phone,
            RolePosition = dto.RolePosition,
            Status = "active"
        };

        var created = await _repo.CreateAsync(employee);
        return MapToDTO(created);
    }

    public async Task<EmployeeDTO?> GetByIdAsync(int id)
    {
        var employee = await _repo.GetByIdAsync(id);
        return employee == null ? null : MapToDTO(employee);
    }

    public async Task<EmployeeDTO> UpdateAsync(int id, UpdateEmployeeDTO dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"Employee with ID {id} not found");

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            existing.FullName = dto.FullName;
        if (dto.Gender != null)
            existing.Gender = dto.Gender;
        if (dto.BirthDate.HasValue)
            existing.BirthDate = dto.BirthDate;
        if (dto.Phone != null)
            existing.Phone = dto.Phone;
        if (dto.RolePosition != null)
            existing.RolePosition = dto.RolePosition;
        if (!string.IsNullOrWhiteSpace(dto.Status))
            existing.Status = dto.Status;

        var updated = await _repo.UpdateAsync(existing);
        return MapToDTO(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    public async Task<IReadOnlyList<EmployeeDTO>> ListAllAsync(string? status = null)
    {
        var employees = await _repo.ListAllAsync(status);
        return employees.Select(MapToDTO).ToList();
    }

    public async Task<IReadOnlyList<EmployeeDTO>> ListAllAsync()
    {
        return await ListAllAsync(null);
    }

    private static EmployeeDTO MapToDTO(Employee employee)
    {
        return new EmployeeDTO
        {
            EmployeeId = employee.EmployeeId,
            FullName = employee.FullName,
            Gender = employee.Gender,
            BirthDate = employee.BirthDate,
            Phone = employee.Phone,
            RolePosition = employee.RolePosition,
            Status = employee.Status
        };
    }
}
