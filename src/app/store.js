import { configureStore } from '@reduxjs/toolkit';
import navPanelReducer from '../widgets/navs/NavPanel/model/slice'

const preloadedState = {
    // user: {
    //     token: localStorage.getItem('token') || null,
    // },
}

export const store = configureStore({
    reducer: {
        navPanel: navPanelReducer,
    },
    preloadedState,
});