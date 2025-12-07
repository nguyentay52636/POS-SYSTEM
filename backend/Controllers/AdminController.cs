using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Net.Mime;

namespace backend.Controllers;

/// <summary>
/// Admin utilities (temporary - for running SQL scripts)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Admin")]
public class AdminController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AdminController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Update Staff permissions (temporary endpoint)
    /// </summary>
    [HttpPost("update-staff-permissions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateStaffPermissions()
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=localhost,1433;Database=bachhoaxanh;User Id=sa;Password=Tay52636@;TrustServerCertificate=True;Encrypt=False;Connection Timeout=30;";

        try
        {
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            // Xóa permissions cũ
            using (var cmd = new SqlCommand("DELETE FROM RolePermissions WHERE RoleId = 2", connection))
            {
                int deleted = await cmd.ExecuteNonQueryAsync();
                Console.WriteLine($"Đã xóa {deleted} permissions cũ");
            }

            // Thêm permissions mới
            var inserts = new[]
            {
                "(2, 2, 1, 1)", // FeatureId 2, View
                "(2, 2, 2, 1)", // FeatureId 2, Create
                "(2, 3, 1, 1)", // FeatureId 3, View
                "(2, 3, 2, 1)", // FeatureId 3, Create
                "(2, 6, 1, 1)", // FeatureId 6, View
                "(2, 6, 2, 1)"  // FeatureId 6, Create
            };

            int inserted = 0;
            foreach (var values in inserts)
            {
                string sql = $"INSERT INTO RolePermissions (RoleId, FeatureId, PermissionTypeId, IsAllowed) VALUES {values}";
                using var cmd = new SqlCommand(sql, connection);
                await cmd.ExecuteNonQueryAsync();
                inserted++;
            }

            // Kiểm tra kết quả
            var results = new List<object>();
            string selectSql = @"
                SELECT 
                    rp.RoleId,
                    r.Description AS RoleName,
                    rp.FeatureId,
                    f.FeatureName,
                    rp.PermissionTypeId,
                    pt.PermissionName,
                    rp.IsAllowed
                FROM RolePermissions rp
                INNER JOIN roles r ON rp.RoleId = r.role_id
                INNER JOIN Features f ON rp.FeatureId = f.FeatureId
                INNER JOIN PermissionTypes pt ON rp.PermissionTypeId = pt.PermissionTypeId
                WHERE rp.RoleId = 2
                ORDER BY rp.FeatureId, rp.PermissionTypeId";

            using (var cmd = new SqlCommand(selectSql, connection))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    results.Add(new
                    {
                        RoleId = reader["RoleId"],
                        RoleName = reader["RoleName"],
                        FeatureId = reader["FeatureId"],
                        FeatureName = reader["FeatureName"],
                        PermissionTypeId = reader["PermissionTypeId"],
                        PermissionName = reader["PermissionName"],
                        IsAllowed = reader["IsAllowed"]
                    });
                }
            }

            return Ok(new
            {
                success = true,
                message = $"Đã cập nhật {inserted} permissions cho Staff",
                permissions = results
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
}

