import { defineRule, configure } from 'vee-validate';

configure({
    bails: false,
    validateOnBlur: false,
    validateOnChange: true,
    validateOnModelUpdate: false,
})

export default defineNuxtPlugin((nuxtApp) => {
    defineRule('name', value => {
        if (!value || !value.length) {
            return 'Please enter your name.';
        }
        return true;
    });

    defineRule('message', value => {
        if (!value || !value.length) {
            return 'Please enter a message.';
        }
        return true;
    });

    defineRule('email', value => {
        // Field is empty, should pass
        if (!value || !value.length) {
            return 'Please enter your email address.';
        }
        // Check if email
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i.test(value)) {
            return 'Please enter your email address.';
        }
        return true;
    });
});