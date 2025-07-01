import { useState } from 'react'
import s from './ConnectionSwitch.module.scss'

export const ConnectionSwitch = () => {
    const [isSwitchOn, setIsSwitchOn] = useState(false)

    const handleConnect = () => {
        setIsSwitchOn(!isSwitchOn)
    }

    return (
        <div className={`${s.wrapper} ${isSwitchOn ? s.on : ''}`} onClick={handleConnect}>
            <div className={s.switch} />
        </div>
    )
}