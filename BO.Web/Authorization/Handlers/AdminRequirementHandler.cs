using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BO.Data;
using BO.Web.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BO.Web.Authorization.Handlers
{
    public class AdminRequirementHandler : AuthorizationHandler<AdminRequirement>
    {
        private readonly BoxOfficeContext _dbContext;
        private readonly  ILogger _logger;

        public AdminRequirementHandler(BoxOfficeContext dbContext, ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger(nameof(AdminRequirementHandler));
        }
        
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminRequirement requirement)
        {
            var userName = (context.User.Identity as ClaimsIdentity)?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                _logger.LogError($"UserName [{userName}] was not found from request context");
                context.Fail();
                return Task.CompletedTask;
            }

            var user = _dbContext.Users
                .Include(i => i.UserRoles)
                .ThenInclude(i => i.Role)
                .FirstOrDefault(i => i.UserName == userName);

            if (user == null)
            {
                _logger.LogError($"User with UserName [{userName}] was not found in the DB");
                context.Fail();
                return Task.CompletedTask;
            }
            
            if (user.UserRoles.Any(i => i.Role?.Name == "Admin"))
            {
                _logger.LogError($"User with UserName [{userName}] is not Admin");
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
            
            return Task.CompletedTask;
        }
    }
}