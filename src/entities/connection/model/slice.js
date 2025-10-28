import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
    twitch: {
        chatChannelName: '',
        connectionStatus: false,
    },
    youtube: {
        youtubeVideoId: '',
        youtubeAccessToken: '',
        connectionStatus: false,
    },
    vk: {
        vkConnectionData: {},
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
}

// Загружаем YouTube из localStorage
let savedYoutube
try {
    savedYoutube = JSON.parse(localStorage.getItem('youtubeConnection'))
} catch {
    savedYoutube = null
}

if (savedYoutube) {
    initialState.youtube = {
        youtubeVideoId: savedYoutube.youtubeVideoId || '',
        youtubeAccessToken: savedYoutube.youtubeAccessToken || '',
        connectionStatus: savedYoutube.connectionStatus || false,
    }
}

// Загружаем Vk из localStorage
let savedVk
try {
    savedVk = JSON.parse(localStorage.getItem('vkConnection'))
} catch {
    savedVk = null
}

if (savedVk) {
    initialState.vk = {
        vkConnectionData: savedVk.vkConnectionData || {},
        connectionStatus: savedVk.connectionStatus || false,
    }
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
            const message = { ...action.payload, time: Date.now(), service: 'twitch' }
            state.messages.push(message)
            if (state.messages.length > 500) {
                state.messages = state.messages.slice(-500) // держим максимум 500 сообщений
            }
        },

        // YouTube
        setYoutubeVideoId: (state, action) => {
            state.youtube.youtubeVideoId = action.payload
            saveYoutubeToLocalStorage(state.youtube)
        },
        setYoutubeAccessToken: (state, action) => {
            state.youtube.youtubeAccessToken = action.payload
            saveYoutubeToLocalStorage(state.youtube)
        },
        setYoutubeConnectionStatus: (state, action) => {
            state.youtube.connectionStatus = action.payload
        },
        setNewYoutubeMessage: (state, action) => {
            const message = { ...action.payload, time: Date.now(), service: 'youtube' }
            state.messages.push(message)
            if (state.messages.length > 500) {
                state.messages = state.messages.slice(-500)
            }
        },

        // VK
        setVkConnectionData: (state, action) => {
            state.vk.vkConnectionData = action.payload
            saveVkToLocalStorage(state.vk)
        },
        setVkConnectionStatus: (state, action) => {
            state.vk.connectionStatus = action.payload
        },
        setNewVkMessage: (state, action) => {
            const message = { ...action.payload, time: Date.now(), service: 'vk' }
            state.messages.push(message)
            if (state.messages.length > 500) {
                state.messages = state.messages.slice(-500)
            }
        },


        setMessages: (state, action) => {
            state.messages = action.payload
        },

        resetConnection: () => ({ ...initialState })
    },
})

export const {
    setTwitchChatChannelName,
    setTwitchConnectionStatus,
    setNewTwitchMessage,

    setYoutubeVideoId,
    setYoutubeAccessToken,
    setYoutubeConnectionStatus,
    setNewYoutubeMessage,

    setVkConnectionData,
    setVkConnectionStatus,
    setNewVkMessage,

    setMessages,
    resetConnection,
} = connectionSlice.actions

export default connectionSlice.reducer

// Селекторы
export const selectTwitchConnectionData = (state) => state.connection.twitch.chatChannelName
export const selectTwitchConnectionStatus = (state) => state.connection.twitch.connectionStatus

export const selectYoutubeVideoId = (state) => state.connection.youtube.youtubeVideoId
export const selectYoutubeAccessToken = (state) => state.connection.youtube.youtubeAccessToken
export const selectYoutubeConnectionStatus = (state) => state.connection.youtube.connectionStatus

export const selectVkConnectionData = (state) => state.connection.vk.vkConnectionData
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
