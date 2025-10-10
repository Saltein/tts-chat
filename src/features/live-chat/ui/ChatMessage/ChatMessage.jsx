import { useEffect, useState } from 'react'
import s from './ChatMessage.module.scss'
import { useSelector } from 'react-redux'
import { selectMessageBackground, selectMessageBackgroundOpacity } from '../../../../entities/message/model/slice'
import { useTheme } from '../../../../shared/context/theme/ThemeContext'

export const ChatMessage = ({ message, timeBeforeDisappear }) => {
    const [visible, setVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    const theme = useTheme().theme

    const nameStyles = {
        color: message.tags["color"]
    }

    let messageBackground = useSelector(selectMessageBackground) // строка вида "255, 0, 0"
    if (messageBackground === '') {
        if (theme === 'dark') {
            messageBackground = '42, 42, 42'
        } else {
            messageBackground = '252, 252, 252'
        }
    }
    const messageBackgroundOpacity = useSelector(selectMessageBackgroundOpacity) // число от 0 до 1

    const wrapperStyles = {
        backgroundColor: `rgba(${messageBackground}, ${messageBackgroundOpacity})`
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
        <div className={`${s.wrapper} ${isFading ? s.fadeOut : ''}`} style={wrapperStyles}>
            <span className={s.name} style={nameStyles}>
                {message.tags["display-name"]}
            </span>
            <span className={s.message}>
                {message.message}
            </span>
        </div>
    )
}
