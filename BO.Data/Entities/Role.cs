using System.Collections.Generic;

namespace BO.Data.Entities
{
    public class Role: BaseEntity
    {
        public string Name { get; set; }
        public List<UserRole> UserRoles { get; set; }
    }
}