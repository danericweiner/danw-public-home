using DanWHome.App_Code;
using DanWHome.Server.Models;
using DanWHome.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace DanWHome.Server.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class ContactDataController : ControllerBase
    {
        private readonly ILogger<ContactDataController> _logger;
        private readonly IEmailSender _emailSender;
        private readonly ApplicationSettings _applicationSettings;

        public ContactDataController(ILogger<ContactDataController> logger, IEmailSender emailSender, IOptions<ApplicationSettings> optionsAccessor) {
            _logger = logger;
            _emailSender = emailSender;
            _applicationSettings = optionsAccessor.Value;
        }

        [HttpPost]
        public async Task<ActionResult> Post(ContactData contact) {
            try {
                string remoteIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();
                double recaptchaThreshold = _applicationSettings.Recaptcha.Threshold;
                double recaptchaScore = CReCaptcha.GetScore(contact.ReCaptchaToken, remoteIP, _applicationSettings.Recaptcha.Secret);
                if (recaptchaScore <= recaptchaThreshold) { throw new Exception("Recaptcha score too low."); }
                await _emailSender.SendEmailAsync(_applicationSettings.EmailSettings.ToAddress,
                    $"Support Request Email",
                    "You received the following message:<br>" +
                                                      $"<br>" +
                                                      $"Name:  {contact.Name}<br>" +
                                                      $"Email:  {contact.Email}<br>" +
                                                      $"Message:  {contact.Message}" +
                                                      "<br>" + 
                                                      $"Recaptcha score: {recaptchaScore}, (Threshold: {recaptchaThreshold})<br>" + 
                                                      $"Remote IP: {remoteIP}");
                return Ok();
            } catch (Exception) {
                return BadRequest();
            }
        }
    }
}
