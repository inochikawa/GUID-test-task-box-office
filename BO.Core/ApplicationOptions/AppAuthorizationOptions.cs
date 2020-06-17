namespace BO.Core.ApplicationOptions
{
    public class AppAuthorizationOptions
    {
        public static string Key => "Authorization";
        
        public string JwtSecret { get; set; }
        public int JwtExpirationSeconds { get; set; }
    }
}