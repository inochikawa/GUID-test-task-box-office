using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace BO.Core.Utils
{
    public static class JwtUtil
    {
        public static string NewJwtToken(string userName, string secret, int expirationSeconds)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddSeconds(expirationSeconds),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}