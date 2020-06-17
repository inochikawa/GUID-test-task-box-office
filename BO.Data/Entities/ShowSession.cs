using System;

namespace BO.Data.Entities
{
    public class ShowSession: BaseEntity
    {
        public DateTimeOffset From { get; set; }
        public DateTimeOffset To { get; set; }

        public int FreeSeats { get; set; }

        public Guid ShowId { get; set; }
        public Show Show { get; set; }
    }
}