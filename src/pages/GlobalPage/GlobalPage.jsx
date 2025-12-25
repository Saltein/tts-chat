import s from './GlobalPage.module.scss'
import { NavPanel } from '../../widgets/navs/NavPanel/NavPanel'
import { ConnectionsPage } from '../OtherPages/ConnectionsPage/ConnectionsPage'
import { Route, Routes } from 'react-router-dom'
import { SettingsPage } from '../OtherPages'
import { LiveChatPage } from '../OtherPages/LiveChatPage/LiveChatPage'
import { TTSPage } from '../OtherPages/TTSPage/TTSPage'
import { TTSChat } from '../../features/tts-chat/TTSChat/TTSChat'
import { Header } from '../../widgets/Header/Header'
import { OAuth2Callback } from '../../features/auth/ui/GoogleLoginButton/OAuth2Callback/OAuth2Callback'

export const GlobalPage = () => {
    return (
        <div className={`${s.wrapper} ${s.forHeader}`}>
            <Header />
            <div className={s.wrapper}>
                <NavPanel />
                <TTSChat />
                <div className={s.pagePart}>
                    <Routes>
                        <Route path='/connections' element={<ConnectionsPage />} />
                        <Route path='' element={<ConnectionsPage />} />
                        <Route path='/live-chat' element={<LiveChatPage />} />
                        <Route path='/settings' element={<SettingsPage />} />
                        <Route path='/tts' element={<TTSPage />} />

                        <Route path="/oauth2callback" element={<OAuth2Callback />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}