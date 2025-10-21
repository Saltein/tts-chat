export const convertUrlToIdYoutube = (str) => {
    try {
        const url = new URL(str)
        if (url.hostname.includes('youtube.com') && url.searchParams.has('v')) {
            return url.searchParams.get('v')
        }
        if (url.hostname.includes('youtu.be')) {
            return url.pathname.slice(1)
        }
    } catch {
        // если str — не ссылка, просто вернуть как есть
    }
    return str
}
