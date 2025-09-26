import { io } from "socket.io-client"
import store from "./store" // путь к твоему redux store
import { setNewYoutubeMessage } from "./connectionSlice"

const baseUrl = process.env.REACT_APP_BASE_URL_API || ''

export const socket = io(baseUrl, {
    transports: ["websocket"],
})

// Ловим сообщения из YouTube
socket.on("youtube_message", (data) => {
    console.log("📥 YouTube message:", data)
    store.dispatch(setNewYoutubeMessage({
        author: data.author,
        message: data.message,
        timestamp: Date.now(),
    }))
})