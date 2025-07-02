import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    twitch: {
        channelName: '',
        chatChannelName: '',
        accessToken: '',
    },
}

const savedTwitch = localStorage.getItem('twitchConnection')
if (savedTwitch) {
    initialState.twitch = JSON.parse(savedTwitch)
}

const saveToLocalStorage = (twitch) => {
    localStorage.setItem('twitchConnection', JSON.stringify(twitch))
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
        }
    },
})

export const { setTwitchChannelName, setTwitchChatChannelName, setTwitchAccessToken, setAllTwitchData } = connectionSlice.actions
export default connectionSlice.reducer

export const selectTwitchConnectionData = (state) => state.connection.twitch
