import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
    twitch: {
        channelName: '',
        chatChannelName: '',
        accessToken: '',
        chatMessages: [],
        connectionStatus: false,
    },
}

let savedTwitch
try {
    savedTwitch = JSON.parse(localStorage.getItem('twitchConnection'))
} catch {
    savedTwitch = null
}

if (savedTwitch) initialState.twitch = savedTwitch

if (savedTwitch) {
    initialState.twitch = {
        channelName: savedTwitch.channelName || '',
        chatChannelName: savedTwitch.chatChannelName || '',
        accessToken: savedTwitch.accessToken || '',
        chatMessages: savedTwitch.chatMessages || [],
    }
}


const saveToLocalStorage = (obj) => {
    localStorage.setItem('twitchConnection', JSON.stringify(obj))
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setTwitchChannelName: (state, action) => {
            state.twitch.channelName = action.payload
            saveToLocalStorage(state.twitch)
        },
        setTwitchChatChannelName: (state, action) => {
            state.twitch.chatChannelName = action.payload
            saveToLocalStorage(state.twitch)
        },
        setTwitchAccessToken: (state, action) => {
            state.twitch.accessToken = action.payload
            saveToLocalStorage(state.twitch)
        },
        setAllTwitchData: (state, action) => {
            state.twitch.channelName = action.payload.channelName
            state.twitch.chatChannelName = action.payload.chatChannelName
            state.twitch.accessToken = action.payload.accessToken
            saveToLocalStorage(state.twitch)
        },

        setNewTwitchMessage: (state, action) => {
            state.twitch.chatMessages.push(action.payload)
        },

        setTwitchConnectionStatus: (state, action) => {
            state.twitch.connectionStatus = action.payload
        },
    },
})

export const {
    setTwitchChannelName,
    setTwitchChatChannelName,
    setTwitchAccessToken,
    setAllTwitchData,
    setNewTwitchMessage,
    setTwitchConnectionStatus,
} = connectionSlice.actions
export default connectionSlice.reducer

export const selectTwitchConnectionData = (state) => state.connection.twitch
export const selectTwitchChatMessages = (state) => state.connection?.twitch?.chatMessages || []
export const selectLast50TwitchMessages = createSelector(
    [selectTwitchChatMessages],
    (messages) => messages.slice(-50)
)
export const selectLastTwitchMessage = createSelector(
    [selectTwitchChatMessages],
    (messages) => messages.slice(-1)
)
export const selectTwitchConnectionStatus = (state) => state.connection.twitch.connectionStatus
