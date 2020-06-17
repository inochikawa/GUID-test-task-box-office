using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BO.Data;
using BO.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BO.Web.Controllers
{
    [Authorize]
    [Route("api/v1/ticket")]
    public class TicketController: Controller
    {
        private readonly BoxOfficeContext _dbContext;

        public TicketController(BoxOfficeContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        [HttpPost("order/{sessionId}")]
        public async Task<IActionResult> OrderTicketAsync(Guid sessionId)
        {
            var session = await _dbContext.ShowSessions
                .Include(i => i.Show)
                .FirstOrDefaultAsync(i => i.Id == sessionId);

            if (session == null)
            {
                return BadRequest($"Show session with id [{sessionId}] was not found");
            }

            var currentUser = await GetCurrentUserAsync();
            
            if (currentUser == null)
            {
                return BadRequest($"User is not logged in into the application");
            }
            
            await CreateTicket(sessionId, currentUser);

            DecrementFreeSeats(session);

            await _dbContext.SaveChangesAsync();
            
            return Ok(session);
        }

        private void DecrementFreeSeats(ShowSession session)
        {
            session.FreeSeats--;
            _dbContext.ShowSessions.Update(session);
        }

        private async Task CreateTicket(Guid sessionId, User currentUser)
        {
            var ticket = new Ticket()
            {
                ShowSessionId = sessionId,
                UserId = currentUser.Id
            };

            await _dbContext.Tickets.AddAsync(ticket);
        }

        private async Task<User> GetCurrentUserAsync()
        {
            var userName = (HttpContext.User.Identity as ClaimsIdentity)?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return await _dbContext.Users.FirstAsync(i => i.UserName == userName);
        }
    }
}