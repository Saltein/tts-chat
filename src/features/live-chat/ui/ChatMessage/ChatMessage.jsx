import { useEffect, useState } from 'react'
import s from './ChatMessage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectFontSize, selectMessageBackground, selectMessageBackgroundOpacity, selectMessageBorder, selectMessageTextColor, selectServiceIcon, setMessageBackground, setMessageTextColor } from '../../../../entities/message/model/slice'
import { useTheme } from '../../../../shared/context/theme/ThemeContext'
import { hexToRgbString, rgbStringToHex } from '../../../../shared/lib/hexToRgbString'

import { ReactComponent as TwitchIcon } from '../../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../../shared/assets/icons/vk-video-logo.svg'
import { ReactComponent as TTSChatIcon } from '../../../../shared/assets/icons/ttschat-logo.svg'
import { ReactComponent as WrenchIcon } from '../../../../shared/assets/icons/wrench.svg'

import { generateColorFromUsername } from '../../../../shared/lib/generateColorFromUsername'

export const ChatMessage = ({ message, timeBeforeDisappear }) => {
    const [visible, setVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    const dispatch = useDispatch()
    const theme = useTheme().theme

    const messageBorder = useSelector(selectMessageBorder)
    const serviceIcon = useSelector(selectServiceIcon)
    const messageBackgroundOpacity = useSelector(selectMessageBackgroundOpacity) // число от 0 до 1
    const fontSize = useSelector(selectFontSize)

    const isModerator =
        message.tags?.badges?.moderator ||
        message.tags?.['is-moderator'] ||
        message?.raw?.push?.pub?.data?.data?.user?.isChannelModerator ||
        message?.raw?.push?.pub?.data?.data?.user?.isChatModerator ||
        null

    const isSponsor =
        message.tags?.badges?.subscriber ||
        message.tags?.['is-sponsor'] ||
        null

    const isOwner =
        message?.raw?.push?.pub?.data?.data?.user?.isOwner

    let nameColor
    let borderColor
    if (message.tags["color"] !== '#FFFFFF') {
        nameColor = message.tags["color"]
    } else {
        nameColor = generateColorFromUsername(message?.tags['display-name'])
    }
    if (isSponsor) {
        borderColor = 'var(--color-sponsor)'
        if (message.service === 'youtube') nameColor = 'var(--color-sponsor)'
    }
    if (isModerator === '1' || isModerator === true) {
        nameColor = 'var(--color-moderator)'
        borderColor = 'var(--color-moderator)'
    }

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

    const wrapperStyles = {
        backgroundColor: `rgba(${messageBackground}, ${messageBackgroundOpacity})`,
        border: messageBorder === false ? `1px solid #00000000` : undefined
    }

    const nameStyles = {
        color: nameColor,
        borderColor: isModerator || isSponsor ? borderColor : undefined,
    }

    const textStyles = {
        color: rgbStringToHex(messageTextColor),
        fontSize: fontSize + 'px',
        top: `${fontSize / 16 * 6 - 9}px`
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

    let Icon
    if (message?.service === 'twitch') {
        Icon = TwitchIcon
    } else if (message?.service === 'youtube') {
        Icon = YoutubeIcon
    } else if (message?.service === 'vk') {
        Icon = VkVideoIcon
    } else if (message?.service === 'ttschat') {
        Icon = TTSChatIcon
    }

    return (
        <div className={`${s.wrapper} ${isFading ? s.fadeOut : ''}`} style={wrapperStyles}>
            <div className={s.name} style={nameStyles}>
                {serviceIcon && <Icon className={s.icon} color={"var(--color-text)"} />}
                {message.tags["display-name"]}
                {isModerator && <WrenchIcon className={s.wrenchIcon} fill="var(--color-moderator)" />}
            </div>
            <span className={s.message} style={textStyles}>
                {message.message}
            </span>
        </div>
    )
}
