import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    mode: 'select',
    roomCode: '',
    inputCode: '',
    connectionStatus: 'disconnected',

    accessStatus: false // Временно, пока все не доделаю
}

const wsRoomSlice = createSlice({
    name: 'wsRoom',
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
        },
        setRoomCode: (state, action) => {
            state.roomCode = action.payload
        },
        setInputCode: (state, action) => {
            state.inputCode = action.payload
        },
        setConnectionStatus: (state, action) => {
            state.connectionStatus = action.payload
        },

        setAccessStatus: (state, action) => {
            state.accessStatus = action.payload
        },
    }
})

export const {
    setMode,
    setRoomCode,
    setInputCode,
    setConnectionStatus,

    setAccessStatus,
} = wsRoomSlice.actions

export default wsRoomSlice.reducer

//Селекторы
export const selectMode = (state) => state.wsRoom.mode
export const selectRoomCode = (state) => state.wsRoom.roomCode
export const selectInputCode = (state) => state.wsRoom.inputCode
export const selectConnectionStatus = (state) => state.wsRoom.connectionStatus

export const selectAccessStatus = (state) => state.wsRoom.accessStatus