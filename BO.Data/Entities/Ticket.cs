using System;

namespace BO.Data.Entities
{
    public class Ticket: BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid ShowSessionId { get; set; }

        public User User { get; set; }
        public ShowSession ShowSession { get; set; }
    }
}