import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentPageID: 0,
}

const navPanelSlice = createSlice({
    name: 'navPanel',
    initialState,
    reducers: {
        setNavPanelCurrentPageID: (state, action) => {
            state.currentPageID = action.payload
        },
    },
})

export const { setNavPanelCurrentPageID } = navPanelSlice.actions
export default navPanelSlice.reducer

export const selectNavPanelCurrentPageID = (state) => state.navPanel.currentPageID