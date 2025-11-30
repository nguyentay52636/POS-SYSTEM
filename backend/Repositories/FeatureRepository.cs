using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IFeatureRepository
{
    Task<Feature> CreateAsync(Feature feature);
    Task<Feature?> GetByIdAsync(int id);
    Task<Feature?> GetByNameAsync(string name);
    Task<Feature> UpdateAsync(Feature feature);
    Task<bool> DeleteAsync(int id);
    Task<IReadOnlyList<Feature>> ListAllAsync();
    Task<bool> ExistsAsync(int id);
}

public class FeatureRepository : IFeatureRepository
{
    private readonly ApplicationDbContext _db;

    public FeatureRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Feature> CreateAsync(Feature feature)
    {
        _db.Features.Add(feature);
        await _db.SaveChangesAsync();
        return feature;
    }

    public Task<Feature?> GetByIdAsync(int id)
    {
        return _db.Features.AsNoTracking().FirstOrDefaultAsync(f => f.FeatureId == id);
    }

    public Task<Feature?> GetByNameAsync(string name)
    {
        return _db.Features.AsNoTracking()
            .FirstOrDefaultAsync(f => f.FeatureName == name);
    }

    public async Task<Feature> UpdateAsync(Feature feature)
    {
        _db.Features.Update(feature);
        await _db.SaveChangesAsync();
        return feature;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Features.FindAsync(id);
        if (existing == null) return false;
        _db.Features.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IReadOnlyList<Feature>> ListAllAsync()
    {
        return await _db.Features
            .AsNoTracking()
            .OrderBy(f => f.FeatureName)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _db.Features.AnyAsync(f => f.FeatureId == id);
    }
}
