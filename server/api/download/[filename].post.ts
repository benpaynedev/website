import { list } from '@vercel/blob'

export default defineEventHandler(async (event) => {
    const filename = getRouterParam(event, 'filename')
    const body = await readBody<{ password: string }>(event)
    const config = useRuntimeConfig(event)

    let passwords: Record<string, string>
    try {
        passwords = JSON.parse(config.DOWNLOAD_PASSWORDS as string)
    } catch {
        throw createError({ statusCode: 500, message: 'Server configuration error' })
    }

    if (!filename || !(filename in passwords)) {
        throw createError({ statusCode: 404, message: 'File not found' })
    }

    if (body.password !== passwords[filename]) {
        throw createError({ statusCode: 401, message: 'Incorrect password' })
    }

    const { blobs } = await list({
        prefix: filename,
        token: config.BLOB_READ_WRITE_TOKEN as string,
    })

    const blob = blobs.find(b => b.pathname === filename)

    if (!blob) {
        throw createError({ statusCode: 404, message: 'File not found' })
    }

    return { url: blob.url }
})
