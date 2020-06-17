using BO.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BO.Data
{
    public class BoxOfficeContext: DbContext
    {
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Show> Shows { get; set; }
        public DbSet<ShowSession> ShowSessions { get; set; }
        
        public BoxOfficeContext(DbContextOptions<BoxOfficeContext> options)
            : base(options)
        {
        }
    }
}