import { setYoutubeConnectionStatus } from "../../../entities/connection/model/slice"
import store from "./store"

export const connectYoutubeChat = async (youtubeVideoID) => {
    try {
        const res = await fetch(`${baseUrl}/api/youtube/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId: youtubeVideoID }),
        })

        if (res.ok) {
            store.dispatch(setYoutubeConnectionStatus(true))
        } else {
            const error = await res.json()
            console.error("Ошибка подключения к чату Youtube:", error)
        }
    } catch (err) {
        console.error("Ошибка подключения к чату Youtube:", err)
    }
}

export const disconnectYoutubeChat = async () => {
    try {
        const res = await fetch(`${baseUrl}/api/youtube/stop`, {
            method: "POST",
        })

        if (res.ok) {
            store.dispatch(setYoutubeConnectionStatus(false))
        } else {
            const error = await res.json()
            console.error("Ошибка отключения от чата Youtube:", error)
        }
    } catch (err) {
        console.error("Ошибка отключения от чата Youtube:", err)
    }
}
