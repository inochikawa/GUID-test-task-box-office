using System;
using System.Linq;
using System.Threading.Tasks;
using BO.Core.Models;
using BO.Data;
using BO.Data.Entities;
using BO.Web.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BO.Web.Controllers
{
    [AllowAnonymous]
    [Route("api/v1/show")]
    public class ShowController : Controller
    {
        private const int DefaultPage = 1;
        private const int DefaultPageSize = 20;
        
        private readonly BoxOfficeContext _dbContext;

        public ShowController(BoxOfficeContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        [HttpGet("")]
        public async Task<IActionResult> GetAllAsync(ShowFilterModel filter, int page = DefaultPage, int pageSize = DefaultPageSize)
        {
            var shows = _dbContext.Shows.Include(i => i.Sessions).AsQueryable();

            if (filter != null)
            {
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    shows = shows.Where(i => i.Name.Contains(filter.Name));
                }

                if (filter.From.HasValue)
                {
                    shows = shows.Where(i => i.Sessions.Any(s => s.From  >= filter.From));
                }

                if (filter.To.HasValue)
                {
                    shows = shows.Where(i => i.Sessions.Any(s => s.To  <= filter.To));
                }
            }

            var requestedShows = (
                    await shows
                        .OrderBy(i => i.Name)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync()
                )
                .Select(i => new ShowItemModel
                {
                    // TODO: filter sessions by date to display appropriate data
                    Name = i.Name,
                    Sessions = i.Sessions.OrderBy(s => s.From).Select(s => new SessionItemModel
                    {
                        Id = s.Id,
                        FreeSeats = s.FreeSeats,
                        From = s.From,
                        To = s.To
                    }).ToList()
                })
                .ToList();
            
            var responseModel= new ShowListResponseModel
            {
                Items = requestedShows,
                TotalItems = await shows.CountAsync()
            };

            return Ok(responseModel);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(Guid id)
        {
            var show = await _dbContext.Shows
                .Include(i => i.Sessions)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (show == null)
            {
                return NotFound($"Show with id [{id}] was not found");
            }
            
            return Ok(show);
        }

        [Authorize(Policy = AdminRequirement.PolicyName)]
        [HttpPost("create")]
        public async Task<IActionResult> CreateShowAsync([FromBody]Show show)
        {
            if (await _dbContext.Shows.AnyAsync(i => i.Id == show.Id))
            {
                return BadRequest($"Show with id [{show.Id}] already exists");
            }
            
            await _dbContext.Shows.AddAsync(show);
            await _dbContext.SaveChangesAsync();
            
            return Ok();
        }
        
        [Authorize(Policy = AdminRequirement.PolicyName)]
        [HttpPost("edit")]
        public async Task<IActionResult> EditShowAsync([FromBody]Show show)
        {
            if (await _dbContext.Shows.AllAsync(i => i.Id != show.Id))
            {
                return BadRequest($"Show with id [{show.Id}] does not exist");
            }

            // Simple way to update entity. 
            // TODO: use separate models and modify existed entity
            
            var oldShow = await _dbContext.Shows.FirstAsync(i => i.Id == show.Id);
            _dbContext.Shows.Remove(oldShow);
            
            await _dbContext.Shows.AddAsync(show);
            await _dbContext.SaveChangesAsync();
            
            return Ok();
        }
        
        [Authorize(Policy = AdminRequirement.PolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShowAsync(Guid id)
        {
            if (await _dbContext.Shows.AllAsync(i => i.Id != id))
            {
                return BadRequest($"Show with id [{id}] does not exist");
            }

            var show = await _dbContext.Shows.FirstAsync(i => i.Id == id);
            _dbContext.Shows.Remove(show);
            await _dbContext.SaveChangesAsync();
            
            return Ok();
        }
    }
}