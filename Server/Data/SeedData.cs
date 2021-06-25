using DanWHome.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace DanWHome.Server.Data
{
    /// <summary>
    /// Adapted from 
    /// https://docs.microsoft.com/en-us/aspnet/core/security/authentication/scaffold-identity?view=aspnetcore-3.1&tabs=visual-studio#disable-register-page
    /// </summary>
    public class SeedData
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<SeedData> _logger;
        private readonly IEmailSender _emailSender;
        private readonly ApplicationSettings _applicationSettings;

        public SeedData(UserManager<ApplicationUser> userManager, ILogger<SeedData> logger, IEmailSender emailSender, IOptions<ApplicationSettings> optionsAccessor) {
            _userManager = userManager;
            _logger = logger;
            _emailSender = emailSender;
            _applicationSettings = optionsAccessor.Value;
        }

        public async Task Initialize() {
            foreach (string seedUser in _applicationSettings.Site.SeedUsers) {
                var userId = await EnsureUser(seedUser);
            }
        }

        private async Task<string> EnsureUser(string email) {
            var user = await _userManager.FindByNameAsync(email);
            if (user == null) {
                user = new ApplicationUser() { UserName = email, Email = email, EmailConfirmed = true };
                await _userManager.CreateAsync(user);
                await NotifyUser(user);
            }
            return user.Id;
        }

        private async Task NotifyUser(ApplicationUser user) {
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            string callbackUrl = $"{_applicationSettings.Site.Domain.TrimEnd('/')}/" +
                                "Identity/Account/ResetPassword" +
                                $"?code={code}";

            await _emailSender.SendEmailAsync(
                user.Email,
                "Account Created",
                $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");
        }
    }
}
