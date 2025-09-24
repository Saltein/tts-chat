import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
    twitch: {
        chatChannelName: '',
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
        setTwitchChatChannelName: (state, action) => {
            state.twitch.chatChannelName = action.payload
            saveToLocalStorage(state.twitch)
        },

        setNewTwitchMessage: (state, action) => {
            state.twitch.chatMessages.push(action.payload)
        },

        setTwitchConnectionStatus: (state, action) => {
            state.twitch.connectionStatus = action.payload
        },

        resetConnection: () => initialState
    },
})

export const {
    setTwitchChatChannelName,
    setNewTwitchMessage,
    setTwitchConnectionStatus,
    resetConnection,
} = connectionSlice.actions
export default connectionSlice.reducer

export const selectTwitchConnectionData = (state) => state.connection.twitch.chatChannelName
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
