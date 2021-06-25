using DanWHome.Server.Models;
using DanWHome.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace DanWHome.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PebbleUsageController : ControllerBase
    {
        private readonly ILogger<PebbleUsageController> _logger;
        private readonly IEmailSender _emailSender;
        private readonly ApplicationSettings _applicationSettings;

        private static readonly HttpClient m_oHttpClient = new HttpClient();

        public PebbleUsageController(ILogger<PebbleUsageController> logger, IEmailSender emailSender, IOptions<ApplicationSettings> optionsAccessor) {
            _logger = logger;
            _emailSender = emailSender;
            _applicationSettings = optionsAccessor.Value;
        }

        [HttpGet]
        public InvocationsData Get() {
            InvocationsData invocationsData = new InvocationsData();
            var oTask = Task.Run(() => GetInvocationsArrayAsync());
            oTask.Wait();
            invocationsData.Invocations = oTask.Result;
            return invocationsData;
        }

        protected async Task<string> GetInvocationsArrayAsync() {
            try {                
                var oMessage = new HttpRequestMessage(HttpMethod.Get, new Uri(_applicationSettings.Apps.PebbleUsage.InvocationsUrl));
                var oResponseMessage = await m_oHttpClient.SendAsync(oMessage);
                return await oResponseMessage.Content.ReadAsStringAsync();                
            } catch (Exception) {
                return "[]";
            }
        }
    }
}
