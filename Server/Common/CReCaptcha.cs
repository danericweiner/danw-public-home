using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace DanWHome.App_Code
{
    //https://stackoverflow.com/questions/27764692/validating-recaptcha-2-no-captcha-recaptcha-in-asp-nets-server-side
    public class CReCaptcha
    {
        [JsonProperty("success")]
        public bool Success { get; set; }
        [JsonProperty("score")]
        public Double Score { get; set; }
        [JsonProperty("action")]
        public string Action { get; set; }
        [JsonProperty("challenge_ts")]
        public string TimeStamp { get; set; }
        [JsonProperty("hostname")]
        public string HostName { get; set; }
        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }

        public static Double GetScore(string recaptchaToken, string hostAdress, string recaptchaSecret) {
            try {
                var oWebClient = new System.Net.WebClient();
                var sVerifyResponse = oWebClient.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}&remoteip={2}", recaptchaSecret, recaptchaToken, hostAdress));
                var oRecaptcha = JsonConvert.DeserializeObject<CReCaptcha>(sVerifyResponse);
                if (oRecaptcha.Success) {
                    return oRecaptcha.Score;
                } else {
                    return -1.1;
                }
            } catch (Exception) {
                return -1.2;
            }            
        }
    }
}