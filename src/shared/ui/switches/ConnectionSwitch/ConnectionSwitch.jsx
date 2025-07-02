import { useState } from 'react'
import s from './ConnectionSwitch.module.scss'

export const ConnectionSwitch = () => {
    const [isSwitchOn, setIsSwitchOn] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleConnect = () => {
        if (isSwitchOn) {
            setIsSwitchOn(false)
            setIsSwitchLoading(false)
        } else {
            setIsSwitchLoading(true)
            setTimeout(() => {
                setIsSwitchOn(!isSwitchOn)
                setIsSwitchLoading(false)
            }, 2000)
        }
    }

    return (
        <div className={`${s.wrapper} ${isSwitchLoading ? s.loading : ''} ${isSwitchOn ? s.on : ''}`} onClick={handleConnect}>
            <div className={s.switch} />
        </div>
    )
}