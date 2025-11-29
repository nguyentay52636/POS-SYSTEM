using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IFeatureRepository
{
    Task<Feature> CreateAsync(Feature feature);
    Task<Feature?> GetByIdAsync(int id);
    Task<Feature?> GetByNameAsync(string name);
    Task<IReadOnlyList<Feature>> ListAllAsync();
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
        return _db.Features.AsNoTracking().FirstOrDefaultAsync(f => f.FeatureName == name);
    }

    public async Task<IReadOnlyList<Feature>> ListAllAsync()
    {
        return await _db.Features.AsNoTracking().ToListAsync();
    }
}
