import { configureStore } from '@reduxjs/toolkit';
import navPanelReducer from '../widgets/navs/NavPanel/model/slice'
import connectionReducer from '../entities/connection/model/slice'
import ttsSettingsReducer from '../features/tts-chat/model/slice'
import messageCustomizationReducer from '../entities/message/model/slice'
import wsRoomReducer from '../features/ws-lobby/model/slice'

const preloadedState = {
    // user: {
    //     token: localStorage.getItem('token') || null,
    // },
}

export const store = configureStore({
    reducer: {
        navPanel: navPanelReducer,
        connection: connectionReducer,
        ttsSettings: ttsSettingsReducer,
        messageCustomization: messageCustomizationReducer,
        wsRoom: wsRoomReducer
    },
    preloadedState,
});