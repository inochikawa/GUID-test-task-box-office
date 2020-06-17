using Microsoft.AspNetCore.Authorization;

namespace BO.Web.Authorization.Requirements
{
    public class AdminRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "Admin";
    }
}