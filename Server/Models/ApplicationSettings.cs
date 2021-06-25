namespace DanWHome.Server.Models
{
    public class ApplicationSettings
    {
        public Site Site { get; set; }
        public EmailSettings EmailSettings { get; set; }        
        public Recaptcha Recaptcha { get; set; }
        public Apps Apps { get; set; }
    }

    public class Site
    {
        public string Domain { get; set; }
        public string[] SeedUsers { get; set; }
    }
  
    public class EmailSettings
    {
        public string ToAddress { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; }
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUserName { get; set; }
        public string SmtpPassword { get; set; }
    }
    public class Recaptcha
    {
        public double Threshold { get; set; }
        public string Secret { get; set; }
    }

    public class Apps
    {
        public EarthService EarthService { get; set; }
        public PebbleUsage PebbleUsage{ get; set; }
    }

    public class EarthService
    {
        public string InvocationsUrl { get; set; }
    }

    public class PebbleUsage
    {
        public string InvocationsUrl { get; set; }
    }
}