window.Contact_Initialize = (dotnetHelper) => {
    grecaptcha.ready(function () {
        grecaptcha.execute('{site_key}', { action: 'Contact' })
            .then(function (token) {
                dotnetHelper.invokeMethodAsync('SetRecaptchaToken', token);
            });
    });
}