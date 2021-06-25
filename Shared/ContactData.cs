using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace DanWHome.Shared
{    
    public class ContactData
    {
        [Required(ErrorMessage = "Please enter a name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter a valid email address")]
        [EmailAddress (ErrorMessage = "Please enter a valid email address")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Please enter a message")]       
        public string Message { get; set; }

        public string ReCaptchaToken { get; set; }
    }
}
