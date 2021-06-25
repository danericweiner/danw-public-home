using DanWHome.Server.Models;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace DanWHome.Server.Common
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<ApplicationSettings> optionsAccessor) {
            ApplicationSettings = optionsAccessor.Value;
        }

        public ApplicationSettings ApplicationSettings { get; }

        public Task SendEmailAsync(string email, string subject, string message) {
            EmailSettings settings = ApplicationSettings.EmailSettings;
            return Execute(email, settings.FromAddress, settings.FromName, subject, message, settings.SmtpServer, settings.SmtpPort, settings.SmtpUserName, settings.SmtpPassword);
        }
        
        public Task Execute(string toAddress, string fromAddress, string fromName, string subject, string message, string smtpServer, int smtpPort, string smtpUserName, string smtpPassword) {
            MailMessage mailMessage = new MailMessage() {
                From = new MailAddress(fromAddress, fromName),
                IsBodyHtml = true,
                Subject = subject,
                Body = message,
            };
            mailMessage.ReplyToList.Add(fromAddress);
            mailMessage.To.Add(toAddress);

            SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort) {
                Credentials = new NetworkCredential(smtpUserName, smtpPassword),
                EnableSsl = true,
                Timeout = 60 * 1000 // 60 seconds
            };

            return smtpClient.SendMailAsync(mailMessage);
        }
    }
}
