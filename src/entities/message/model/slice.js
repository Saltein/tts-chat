import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    messageBackground: '',
    messageBackgroundOpacity: 1,
    messageBorder: true,
    messageTextColor: '',
    messageLifeTime: 30000,
    messageGap: '8',
    serviceIcon: true,
    fontSize: 16,
}

// Загружаем параметры из localStorage
try {
    const saved = JSON.parse(localStorage.getItem('chatCustomization'))
    if (saved) {
        initialState = {
            messageBackground: saved.messageBackground ?? '',
            messageBackgroundOpacity: saved.messageBackgroundOpacity ?? 1,
            messageBorder: saved.messageBorder ?? true,
            messageTextColor: saved.messageTextColor ?? '',
            messageLifeTime: saved.messageLifeTime ?? 30000,
            messageGap: saved.messageGap ?? '8',
            serviceIcon: saved.serviceIcon ?? true,
            fontSize: saved.fontSize ?? '16px',
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
            state.messageBorder = action.payload
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
        setMessageGap: (state, action) => {
            state.messageGap = action.payload
            saveToLocalStorage(state)
        },
        setServiceIcon: (state, action) => {
            state.serviceIcon = action.payload
            saveToLocalStorage(state)
        },
        setFontSize: (state,action) => {
            state.fontSize = action.payload
            saveToLocalStorage(state)
        }
    }
})

export const {
    setMessageBackground,
    setMessageBackgroundOpacity,
    setMessageBorder,
    setMessageTextColor,
    setMessageLifeTime,
    setMessageGap,
    setServiceIcon,
    setFontSize
} = messageCustomizationSlice.actions

export default messageCustomizationSlice.reducer

// Селекторы
export const selectMessageBackground = (state) => state.messageCustomization.messageBackground
export const selectMessageBackgroundOpacity = (state) => state.messageCustomization.messageBackgroundOpacity
export const selectMessageBorder = (state) => state.messageCustomization.messageBorder
export const selectMessageTextColor = (state) => state.messageCustomization.messageTextColor
export const selectMessageLifeTime = (state) => state.messageCustomization.messageLifeTime
export const selectMessageGap = (state) => state.messageCustomization.messageGap
export const selectServiceIcon = (state) => state.messageCustomization.serviceIcon
export const selectFontSize = (state) => state.messageCustomization.fontSize