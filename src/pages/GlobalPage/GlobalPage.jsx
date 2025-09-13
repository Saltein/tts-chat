import s from './GlobalPage.module.scss'
import { NavPanel } from '../../widgets/navs/NavPanel/NavPanel'
import { ConnectionsPage } from '../OtherPages/ConnectionsPage/ConnectionsPage'
import { Route, Routes } from 'react-router-dom'
import { SettingsPage } from '../OtherPages'
import { LiveChatPage } from '../OtherPages/LiveChatPage/LiveChatPage'
import { TTSPage } from '../OtherPages/TTSPage/TTSPage'
import { TTSChat } from '../../features/tts-chat/TTSChat/TTSChat'

export const GlobalPage = () => {
    return (
        <div className={s.wrapper}>
            <NavPanel />
            <TTSChat />
            <div className={s.pagePart}>
                <Routes>
                    <Route path='/connections' element={<ConnectionsPage />} />
                    <Route path='/live-chat' element={<LiveChatPage />} />
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/tts' element={<TTSPage />} />
                </Routes>
            </div>
        </div>
    )
}