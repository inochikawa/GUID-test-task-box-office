using System;

namespace BO.Core.Models
{
    public class ShowFilterModel
    {
        public string Name { get; set; }
        public DateTimeOffset? From { get; set; }
        public DateTimeOffset? To { get; set; }
    }
}