import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    common: {
        speechVolume: 50,
    },
    twitch: {
        ttsOn: 'false',
        voice: 'random',
    }
}

let savedSettings;
try {
    savedSettings = JSON.parse(localStorage.getItem('ttsSettings'));
} catch {
    savedSettings = null;
}

if (savedSettings) {
    initialState = {
        common: {
            speechVolume: savedSettings.common?.speechVolume || 50,
        },
        twitch: {
            ttsOn: savedSettings.twitch?.ttsOn || 'false',
            voice: savedSettings.twitch?.voice || 'random',
        },
    };
}

const saveToLocalStorage = (obj) => {
    localStorage.setItem('ttsSettings', JSON.stringify(obj))
}

const ttsSettingsSlice = createSlice({
    name: 'ttsSettings',
    initialState,
    reducers: {
        setSpeechVolume: (state, action) => {
            state.common.speechVolume = action.payload
            saveToLocalStorage(state)
        },
        setTwitchTTSOn: (state, action) => {
            state.twitch.ttsOn = action.payload
            saveToLocalStorage(state)
        },
        setTwitchVoice: (state, action) => {
            state.twitch.voice = action.payload
            saveToLocalStorage(state)
        },
        resetSettings: () => initialState,
    }
})

export const {
    setSpeechVolume,
    setTwitchTTSOn,
    setTwitchVoice,
    resetSettings,
} = ttsSettingsSlice.actions
export default ttsSettingsSlice.reducer

export const selectSpeechVolume = (state) => state.ttsSettings.common.speechVolume
export const selectTwitchTTSOn = (state) => state.ttsSettings.twitch.ttsOn
export const selectTwitchVoice = (state) => state.ttsSettings.twitch.voice