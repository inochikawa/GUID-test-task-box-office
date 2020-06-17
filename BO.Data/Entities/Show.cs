using System.Collections.Generic;

namespace BO.Data.Entities
{
    public class Show: BaseEntity
    {
        public string Name { get; set; }

        public List<ShowSession> Sessions { get; set; }
    }
}