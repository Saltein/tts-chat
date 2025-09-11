import s from './GlobalPage.module.scss'
import { NavPanel } from '../../widgets/navs/NavPanel/NavPanel'
import { ConnectionsPage } from '../OtherPages/ConnectionsPage/ConnectionsPage'
import { Route, Routes } from 'react-router-dom'
import { SettingsPage } from '../OtherPages'
import { LiveChatPage } from '../OtherPages/LiveChatPage/LiveChatPage'

export const GlobalPage = () => {
    return (
        <div className={s.wrapper}>
            <NavPanel />
            <div className={s.pagePart}>
                <Routes>
                    <Route path='/connections' element={<ConnectionsPage />} />
                    <Route path='/live-chat' element={<LiveChatPage />} />
                    <Route path='/settings' element={<SettingsPage />} />
                </Routes>
            </div>
        </div>
    )
}