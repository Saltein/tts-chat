import { createSelector, createSlice } from '@reduxjs/toolkit'

let initialState = {
    messageBackground: '',
    messageBackgroundOpacity: 1,
}

// Загружаем параметры из localStorage
let saved
try {
    saved = JSON.parse(localStorage.getItem('chatCustomization'))
} catch {
    saved = null
}
if (saved) {
    initialState = {
        messageBackground: saved.messageBackground || '',
        messageBackgroundOpacity: saved.messageBackgroundOpacity || 1,
    }
}

// Сохраняем localStorage
const saveToLocalStorage = (state) => {
    localStorage.setItem('chatCustomization', JSON.stringify({
        ...state
    }))
}

const messageCustomizationSlice = createSlice({
    name: 'messageCustomization',
    initialState,
    reducers: {
        setMessageBackground: (state, action) => {
            state.messageBackground = action.payload
            saveToLocalStorage(state)
        },

        setMessageBackgroundOpacity: (state, action) => {
            state.messageBackgroundOpacity = action.payload
            saveToLocalStorage(state)
        },
    }
})

export const {
    setMessageBackground,
    setMessageBackgroundOpacity,
} = messageCustomizationSlice.actions

export default messageCustomizationSlice.reducer


// Селекторы
export const selectMessageBackground = (state) => state.messageCustomization.messageBackground
export const selectMessageBackgroundOpacity = (state) => state.messageCustomization.messageBackgroundOpacity