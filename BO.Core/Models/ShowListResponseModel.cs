using System;
using System.Collections.Generic;

namespace BO.Core.Models
{
    public class ShowListResponseModel
    {
        public List<ShowItemModel> Items { get; set; }
        public int TotalItems { get; set; }
    }

    public class ShowItemModel
    {
        public string Name { get; set; }
        public List<SessionItemModel> Sessions { get; set; }
    }

    public class SessionItemModel
    {
        public Guid Id { get; set; }
        public int FreeSeats { get; set; }
        public DateTimeOffset From { get; set; }
        public DateTimeOffset To { get; set; }
    }
}