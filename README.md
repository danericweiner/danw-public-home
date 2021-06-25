# DanW Home
Blazor WebAssembly single page application (client-side C# SPA) homepage for [danericweiner.com](https://danericweiner.com/).

Supports:

- Dashboards for monitoring [FitBit](https://gallery.fitbit.com/details/5e3eddac-b15b-42af-b4b9-be1799eea082)/[Pebble](https://github.com/danericweiner/pebble-dayboat-marine-face) watch app microservices/IoT, with Google Maps overlays containing:
  - Aggregated recent pings
  - Timings of source data services
  - JSON responses
- Seed user configuration with password reset emails after code-first database creation
- Client-side resource minification
- Two-factor authentication with QR-code config
- Contact form
- [Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-5.0&tabs=windows) was used for private keys in development (environment variables in production)

------

## Build

- In `Client\wwwroot\js\contact.js`, add a [reCAPTCHA](https://developers.google.com/recaptcha) `{site_key}` 
- In `Client\wwwroot\index.html`, replace the Google Maps and reCAPTCHA `{key}`
- In `Server\appsettings.json`, in `ApplicationSettings` add:
  - A string-array of `Site/SeedUsers` email addresses for reset emails
  - SMTP server information in `EmailSettings`
  - If you're not using secret manager, then also add the remaining items from `Server\Models\ApplicationSettings.cs` and fill them in
- Remove the `Web.config` to run locally

------

## Deploy

### Server

1. Download and install [.NET 5 Web Hosting Bundle](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-aspnetcore-5.0.7-windows-hosting-bundle-installer)
2. Create a self-signed certificate in IIS (`Store: Personal`)
3. Configure the IIS App Pool with: 
   - `.NET CLR Version: No Managed Code` 
   - Full control of the application directory
   - Full control of the certificate 
     ```
     MMC > Snap in > Certificates (Local Computer) > Personal > Certificates > Right-click > All Tasks > Manage Private Keys
     ```
4. Add environment variables with secrets if using secret manager e.g.: 
```
DanWHome_ApplicationSettings__EmailSettings__SmtpUserName=secret
```

### Locally

1. Publish the project to the server with Web Deploy

