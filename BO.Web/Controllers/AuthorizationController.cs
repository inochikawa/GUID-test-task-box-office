using System.Linq;
using System.Threading.Tasks;
using BO.Core.ApplicationOptions;
using BO.Core.Models;
using BO.Core.Utils;
using BO.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BO.Web.Controllers
{
    // TODO: add auto renew token
    [AllowAnonymous]
    [Route("api/v1/authorization")]
    public class AuthorizationController : Controller
    {
        private readonly BoxOfficeContext _dbContext;
        private readonly AppAuthorizationOptions _authOptions;
        private readonly ILogger _logger;

        public AuthorizationController(IOptions<AppAuthorizationOptions> authOptions, BoxOfficeContext dbContext, ILoggerFactory loggerFactory)
        {
            _authOptions = authOptions.Value;
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger(nameof(AuthorizationController));
        }
        
        [HttpPost("")]
        public async Task<IActionResult> AuthorizeAsync([FromBody]AuthorizationModel authorizationModel)
        {
            var user = await _dbContext.Users
                .Include(i => i.UserRoles)
                .ThenInclude(i => i.Role)
                .FirstOrDefaultAsync(i => 
                    i.UserName == authorizationModel.UserName
                    && i.Password == authorizationModel.Password);

            if (user == null)
            {
                _logger.LogError($"User [{authorizationModel.UserName}] was not found in the DB. UserName or Password is not correct");
                return BadRequest($"Wrong credentials for user [{authorizationModel.UserName}]");
            }

            var token = JwtUtil.NewJwtToken(authorizationModel.UserName, _authOptions.JwtSecret,
                _authOptions.JwtExpirationSeconds);
            
            var response = new AuthorizationResponseModel
            {
                Token = token,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                IsAdmin = user.UserRoles.Any(i => i.Role?.Name == "Admin")
            };
            
            return Ok(response);
        }
    }
}