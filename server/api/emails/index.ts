export default defineEventHandler(async (event) => {
    let method = getMethod(event);

    if (method === 'GET') {
        // Stub: future use for polling send status
        return { status: 'idle' };
    }

    if (method === 'POST') {
        const config = useRuntimeConfig(event);
        const body = await readBody<{ name: string; email: string; message: string }>(event);

        const formData = new FormData();
        formData.append('from', `${body.name} <${body.email}>`);
        formData.append('to', config.WEBMASTER_EMAIL as string);
        formData.append('subject', `Website message from ${body.name}`);
        formData.append('text', body.message);

        await $fetch('https://api.mailgun.net/v3/mail.benpayne.dev/messages', {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + Buffer.from(`api:${config.MAILGUN_API_KEY}`).toString('base64'),
            },
            body: formData,
        });

        return { success: true };
    }

    throw createError({ statusCode: 405, message: 'Method Not Allowed' });
});
