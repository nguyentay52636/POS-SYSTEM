using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using backend.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public interface IJwtService
    {
        (string Token, DateTime ExpiresAt) GenerateToken(string username, string userId, string role);
    }

    public class JwtService : IJwtService
    {
        private readonly JwtConfig _jwtConfig;

        public JwtService(IOptions<JwtConfig> jwtConfig)
        {
            _jwtConfig = jwtConfig.Value;
        }

        public (string Token, DateTime ExpiresAt) GenerateToken(string username, string userId, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtConfig.ExpireMinutes);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: _jwtConfig.Issuer,
                audience: _jwtConfig.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
        }
    }
}
