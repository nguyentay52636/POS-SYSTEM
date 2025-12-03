using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories;

public interface IConfigCustomerPointRepository
{
    Task<ConfigCustomerPoint?> GetActiveConfigAsync();
    Task<ConfigCustomerPoint> UpdateConfigAsync(ConfigCustomerPoint config);
}

public class ConfigCustomerPointRepository : IConfigCustomerPointRepository
{
    private readonly ApplicationDbContext _context;

    public ConfigCustomerPointRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ConfigCustomerPoint?> GetActiveConfigAsync()
    {
        return await _context.ConfigCustomerPoints
            .FirstOrDefaultAsync(c => c.IsActive == true);
    }

    public async Task<ConfigCustomerPoint> UpdateConfigAsync(ConfigCustomerPoint config)
    {
        // Deactivate all existing configs
        var existingConfigs = _context.ConfigCustomerPoints.Where(c => c.IsActive == true);
        foreach (var existing in existingConfigs)
        {
            existing.IsActive = false;
        }

        // Add or update the new config
        config.IsActive = true;
        config.UpdatedAt = DateTime.Now;

        var existingConfig = await _context.ConfigCustomerPoints
            .FirstOrDefaultAsync(c => c.ConfigId == config.ConfigId);

        if (existingConfig != null)
        {
            existingConfig.PointsPerUnit = config.PointsPerUnit;
            existingConfig.MoneyPerUnit = config.MoneyPerUnit;
            existingConfig.IsActive = true;
            existingConfig.UpdatedAt = DateTime.Now;
            _context.ConfigCustomerPoints.Update(existingConfig);
        }
        else
        {
            await _context.ConfigCustomerPoints.AddAsync(config);
        }

        await _context.SaveChangesAsync();
        return existingConfig ?? config;
    }
}
