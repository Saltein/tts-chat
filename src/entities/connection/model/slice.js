import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
    twitch: {
        chatChannelName: '',
        connectionStatus: false,
    },
    youtube: {
        youtubeVideoId: '',
        connectionStatus: false,
    },
    vk: {
        vkChannelId: '',
        connectionStatus: false,
    },
    messages: [] // общий массив сообщений
}

// Загружаем Twitch из localStorage
let savedTwitch
try {
    savedTwitch = JSON.parse(localStorage.getItem('twitchConnection'))
} catch {
    savedTwitch = null
}

if (savedTwitch) {
    initialState.twitch = {
        chatChannelName: savedTwitch.chatChannelName || '',
        connectionStatus: savedTwitch.connectionStatus || false,
    }
    initialState.messages = savedTwitch.chatMessages?.map(msg => ({ ...msg, service: 'twitch' })) || []
}

// Сохраняем localStorage
const saveTwitchToLocalStorage = (twitch) => {
    localStorage.setItem('twitchConnection', JSON.stringify({
        ...twitch
    }))
}
const saveYoutubeToLocalStorage = (youtube) => {
    localStorage.setItem('youtubeConnection', JSON.stringify({
        ...youtube
    }))
}
const saveVkToLocalStorage = (vk) => {
    localStorage.setItem('vkConnection', JSON.stringify({
        ...vk
    }))
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        // Twitch
        setTwitchChatChannelName: (state, action) => {
            state.twitch.chatChannelName = action.payload
            saveTwitchToLocalStorage(state.twitch)
        },
        setTwitchConnectionStatus: (state, action) => {
            state.twitch.connectionStatus = action.payload
        },
        setNewTwitchMessage: (state, action) => {
            const message = { ...action.payload, service: 'twitch' }
            state.messages.push(message)
        },

        // YouTube
        setYoutubeVideoId: (state, action) => {
            state.youtube.youtubeVideoId = action.payload
            saveYoutubeToLocalStorage(state.youtube)
        },
        setYoutubeConnectionStatus: (state, action) => {
            state.youtube.connectionStatus = action.payload
        },
        setNewYoutubeMessage: (state, action) => {
            const message = { ...action.payload, service: 'youtube' }
            state.messages.push(message)
        },

        // VK
        setVkChannelId: (state, action) => {
            state.vk.vkChannelId = action.payload
            saveVkToLocalStorage(state.vk)
        },
        setVkConnectionStatus: (state, action) => {
            state.vk.connectionStatus = action.payload
        },
        setNewVkMessage: (state, action) => {
            const message = { ...action.payload, service: 'vk' }
            state.messages.push(message)
        },

        resetConnection: () => initialState
    },
})

export const {
    setTwitchChatChannelName,
    setTwitchConnectionStatus,
    setNewTwitchMessage,
    setYoutubeVideoId,
    setYoutubeConnectionStatus,
    setNewYoutubeMessage,
    setVkChannelId,
    setVkConnectionStatus,
    setNewVkMessage,
    resetConnection,
} = connectionSlice.actions

export default connectionSlice.reducer

// Селекторы
export const selectTwitchConnectionData = (state) => state.connection.twitch.chatChannelName
export const selectTwitchConnectionStatus = (state) => state.connection.twitch.connectionStatus

export const selectYoutubeConnectionData = (state) => state.connection.youtube.youtubeVideoId
export const selectYoutubeConnectionStatus = (state) => state.connection.youtube.connectionStatus

export const selectVkConnectionData = (state) => state.connection.vk.vkChannelId
export const selectVkConnectionStatus = (state) => state.connection.vk.connectionStatus



export const selectMessages = (state) => state.connection.messages
export const selectLast50Messages = createSelector(
    [selectMessages],
    (messages) => messages.slice(-50)
)
export const selectLastMessage = createSelector(
    [selectMessages],
    (messages) => messages.slice(-1)
)

// Селекторы по сервису
export const selectTwitchMessages = createSelector(
    [selectMessages],
    (messages) => messages.filter(msg => msg.service === 'twitch')
)
export const selectYoutubeMessages = createSelector(
    [selectMessages],
    (messages) => messages.filter(msg => msg.service === 'youtube')
)
export const selectLast50TwitchMessages = createSelector(
    [selectTwitchMessages],
    (messages) => messages.slice(-50)
)
export const selectLast50YoutubeMessages = createSelector(
    [selectYoutubeMessages],
    (messages) => messages.slice(-50)
)
