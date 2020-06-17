using System.Collections.Generic;
using BO.Data.Entities;
using Microsoft.EntityFrameworkCore.Internal;

namespace BO.Data.SeedData
{
    public partial class SeedData
    {
        public static void Users(BoxOfficeContext dbContext)
        {
            if (dbContext.Users.Any())
            {
                return;
            }

            var adminUser = new User
            {
                FirstName = "Maxim",
                LastName = "Stecenko",
                UserName = "admin",
                Password = "admin",
                UserRoles = new List<UserRole>
                {
                    new UserRole
                    {
                        Role = new Role
                        {
                            Name = "Admin"
                        }
                    }
                }
            };

            dbContext.Users.Add(adminUser);
            dbContext.SaveChanges();
        }
    }
}