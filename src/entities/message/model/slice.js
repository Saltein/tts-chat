import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    messageBackground: '',
    messageBackgroundOpacity: 1,
    messageBorder: true, // 👈 булево, а не строка
    messageTextColor: '',
    messageLifeTime: 30000
}

// Загружаем параметры из localStorage
try {
    const saved = JSON.parse(localStorage.getItem('chatCustomization'))
    if (saved) {
        initialState = {
            messageBackground: saved.messageBackground ?? '',
            messageBackgroundOpacity: saved.messageBackgroundOpacity ?? 1,
            messageBorder: typeof saved.messageBorder === 'boolean'
                ? saved.messageBorder
                : saved.messageBorder === 'true', // 👈 если вдруг сохранилась строка
            messageTextColor: saved.messageTextColor ?? '',
            messageLifeTime: saved.messageLifeTime ?? 30000,
        }
    }
} catch {
    // просто игнорируем ошибку
}

// Сохраняем localStorage
const saveToLocalStorage = (state) => {
    localStorage.setItem('chatCustomization', JSON.stringify(state))
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
        setMessageBorder: (state, action) => {
            state.messageBorder = !!action.payload // 👈 гарантированно boolean
            saveToLocalStorage(state)
        },
        setMessageTextColor: (state, action) => {
            state.messageTextColor = action.payload
            saveToLocalStorage(state)
        },
        setMessageLifeTime: (state, action) => {
            state.messageLifeTime = action.payload
            saveToLocalStorage(state)
        },
    }
})

export const {
    setMessageBackground,
    setMessageBackgroundOpacity,
    setMessageBorder,
    setMessageTextColor,
    setMessageLifeTime,
} = messageCustomizationSlice.actions

export default messageCustomizationSlice.reducer

// Селекторы
export const selectMessageBackground = (state) => state.messageCustomization.messageBackground
export const selectMessageBackgroundOpacity = (state) => state.messageCustomization.messageBackgroundOpacity
export const selectMessageBorder = (state) => state.messageCustomization.messageBorder
export const selectMessageTextColor = (state) => state.messageCustomization.messageTextColor
export const selectMessageLifeTime = (state) => state.messageCustomization.messageLifeTime