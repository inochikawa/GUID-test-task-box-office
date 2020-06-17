using System;
using System.Collections.Generic;

namespace BO.Data.Entities
{
    public class User: BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        
        // TODO: do not store password in the DB. Replace with PasswordSalt.
        public string Password { get; set; }

        public List<UserRole> UserRoles { get; set; }
    }
}