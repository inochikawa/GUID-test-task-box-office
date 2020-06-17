using System.Threading.Tasks;
using BO.Core.Models;
using BO.Data;
using BO.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BO.Web.Controllers
{
    // TODO: add user's management (Edit, Delete)
    [Route("api/v1/user")]
    public class UserController : Controller
    {
        private readonly BoxOfficeContext _dbContext;

        public UserController(BoxOfficeContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        [HttpPost("")]
        public async Task<IActionResult> RegisterAsync([FromBody]RegisterModel registerModel)
        {
            if (string.IsNullOrEmpty(registerModel.UserName) 
                || string.IsNullOrEmpty(registerModel.Password))
            {
                return BadRequest("UserName or Password is empty");
            }

            if (registerModel.Password != registerModel.ConfirmPassword)
            {
                return BadRequest("Passwords are not equals");
            }

            // TODO: move to UserService
            // TODO: use AutoMapper or similar tool
            var user = new User
            {
                FirstName = registerModel.FirstName,
                LastName = registerModel.LastName,
                UserName = registerModel.UserName,
                Password = registerModel.Password
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}