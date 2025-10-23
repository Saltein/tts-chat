export const convertUrlToIdYoutube = (str) => {
    try {
        const url = new URL(str)

        // классическая ссылка: https://www.youtube.com/watch?v=ID
        if (url.hostname.includes('youtube.com') && url.searchParams.has('v')) {
            return url.searchParams.get('v')
        }

        // короткая ссылка: https://youtu.be/ID
        if (url.hostname.includes('youtu.be')) {
            return url.pathname.slice(1)
        }

        // ссылка на трансляцию: https://youtube.com/live/ID?feature=share
        if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/live/')) {
            return url.pathname.split('/live/')[1].split('/')[0]
        }
    } catch {
        // если str — не ссылка, просто вернуть как есть
    }

    return str
}
