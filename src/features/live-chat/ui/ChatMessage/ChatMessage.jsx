import { useEffect, useState } from 'react'
import s from './ChatMessage.module.scss'

export const ChatMessage = ({ message, timeBeforeDisappear }) => {
    const [visible, setVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    const styles = {
        color: message.tags["color"]
    }

    useEffect(() => {
        // через timeBeforeDisappear начинаем исчезать
        const fadeTimeout = setTimeout(() => setIsFading(true), timeBeforeDisappear)
        // через timeBeforeDisappear + 300 скрываем полностью
        const removeTimeout = setTimeout(() => setVisible(false), timeBeforeDisappear + 300)

        return () => {
            clearTimeout(fadeTimeout)
            clearTimeout(removeTimeout)
        }
    }, [timeBeforeDisappear])

    if (!visible) return null

    return (
        <div className={`${s.wrapper} ${isFading ? s.fadeOut : ''}`}>
            <span className={s.name} style={styles}>
                {message.tags["display-name"]}
            </span>
            <span className={s.message}>
                {message.message}
            </span>
        </div>
    )
}
