namespace BO.Core.Models
{
    public class AuthorizationResponseModel
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAdmin { get; set; }
    }
}