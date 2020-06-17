using System;
using System.Collections.Generic;
using System.Linq;
using BO.Data.Entities;
using Microsoft.EntityFrameworkCore.Internal;

namespace BO.Data.SeedData
{
    public partial class SeedData
    {
        public static void Shows(BoxOfficeContext dbContext)
        {
            if (EnumerableExtensions.Any(dbContext.Tickets))
            {
                return;
            }

            var shows = Enumerable.Range(1, 55).Select(i => new Show()
            {
                Name = $"Show {i}",
                Sessions = new List<ShowSession>()
                {
                    new ShowSession()
                    {
                        From = DateTimeOffset.UtcNow,
                        To = DateTimeOffset.UtcNow.AddHours(2),
                        FreeSeats = 100
                    },
                    new ShowSession()
                    {
                        From = DateTimeOffset.UtcNow.AddDays(1),
                        To = DateTimeOffset.UtcNow.AddDays(1).AddHours(2),
                        FreeSeats = 100
                    }
                }
            });
            
            dbContext.AddRange(shows);
            dbContext.SaveChanges();
        }
    }
}