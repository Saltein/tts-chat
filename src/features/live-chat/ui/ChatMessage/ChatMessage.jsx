import { useEffect, useState } from 'react'
import s from './ChatMessage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectMessageBackground, selectMessageBackgroundOpacity, selectMessageBorder, selectMessageTextColor, setMessageBackground, setMessageTextColor } from '../../../../entities/message/model/slice'
import { useTheme } from '../../../../shared/context/theme/ThemeContext'
import { hexToRgbString, rgbStringToHex } from '../../../../shared/lib/hexToRgbString'

export const ChatMessage = ({ message, timeBeforeDisappear }) => {
    const [visible, setVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    const dispatch = useDispatch()

    const theme = useTheme().theme

    const nameStyles = {
        color: message.tags["color"]
    }

    const messageBorder = useSelector(selectMessageBorder)

    let messageTextColor = useSelector(selectMessageTextColor)
    if (messageTextColor === '') {
        if (theme === 'dark') {
            messageTextColor = hexToRgbString('#f3f4f6')
            dispatch(setMessageTextColor(messageTextColor))
        } else {
            messageTextColor = hexToRgbString('#111827')
            dispatch(setMessageTextColor(messageTextColor))
        }
    }

    let messageBackground = useSelector(selectMessageBackground) // строка вида "255, 0, 0"
    if (messageBackground === '') {
        if (theme === 'dark') {
            messageBackground = '42, 42, 42'
            dispatch(setMessageBackground(messageBackground))
        } else {
            messageBackground = '252, 252, 252'
            dispatch(setMessageBackground(messageBackground))
        }
    }
    const messageBackgroundOpacity = useSelector(selectMessageBackgroundOpacity) // число от 0 до 1

    const wrapperStyles = {
        backgroundColor: `rgba(${messageBackground}, ${messageBackgroundOpacity})`,
        border: messageBorder === false ? `1px solid #00000000` : undefined
    }

    const textStyles = {
        color: rgbStringToHex(messageTextColor)
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
            <span className={s.message} style={textStyles}>
                {message.message}
            </span>
        </div>
    )
}
