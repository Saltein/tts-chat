import { useSearchParams } from 'react-router-dom'
import { LiveChat } from '../../../features/live-chat/ui/LiveChat/LiveChat'
import s from './ChatWidget.module.scss'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { connectTwitchClient } from '../../../features/live-chat/lib/twitchClientSingleton'
import { setNewTwitchMessage, setNewYoutubeMessage } from '../../../entities/connection/model/slice'
import { TTSChat } from '../../../features/tts-chat/TTSChat/TTSChat'
import { useTheme } from '../../../shared/context/theme/ThemeContext'
import { connectYouTubeClient } from '../../../features/live-chat/lib/youtube/youtubeClientSingleton'
import { setMessageBackground, setMessageBackgroundOpacity, setMessageLifeTime, setMessageTextColor } from '../../../entities/message/model/slice'

export const ChatWidget = () => {
    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN

    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { setTheme } = useTheme()

    const voiceVolume = searchParams.get('volume') || 1
    const twitchVoice = searchParams.get('twitchVoice') || 'random'
    const targetTheme = searchParams.get('theme') || 'dark'

    const messageBackgroundColor = searchParams.get('messageBackgroundColor')
    const messageBackgroundOpacity = searchParams.get('messageBackgroundOpacity')
    const messageTextColor = searchParams.get('messageTextColor')
    const messageLifeTime = searchParams.get('messageLifeTime')

    const twitchChatChannelName = searchParams.get('twitchChatChannelName') || ''
    const twitchConnectionStatus = searchParams.get('twitchConnectionStatus') === 'true'

    const youtubeVideoId = searchParams.get('youtubeVideoId') || ''
    const youtubeAccessToken = searchParams.get('youtubeAccessToken') || ''
    const youtubeConnectionStatus = searchParams.get('youtubeConnectionStatus') === 'true'

    // Разделяем рефы для Twitch и YouTube
    const twitchClientRef = useRef(null)
    const youtubeClientRef = useRef(null)

    dispatch(setMessageBackground(messageBackgroundColor))
    dispatch(setMessageBackgroundOpacity(messageBackgroundOpacity))
    dispatch(setMessageTextColor(messageTextColor))
    dispatch(setMessageLifeTime(messageLifeTime))

    const handleTwitchConnect = () => {
        if (!twitchConnectionStatus || twitchClientRef.current) return

        const client = connectTwitchClient({
            token: twitchBotToken,
            botNick: twitchBotName,
            channel: { chatChannelName: twitchChatChannelName },
        })

        if (client) {
            twitchClientRef.current = client
            client.on("message", (channel, tags, message, self) => {
                dispatch(setNewTwitchMessage({ channel, tags, message, self }))
            })
        }
    }

    const handleYouTubeConnect = async () => {
        if (!youtubeConnectionStatus || !youtubeVideoId || !youtubeAccessToken || youtubeClientRef.current) return

        try {
            const callbacks = {
                onChatMessage: (msg) => dispatch(setNewYoutubeMessage(msg)),
                onConnected: () => console.log('✅ YouTube чат подключен'),
                onDisconnected: () => console.log('❌ YouTube чат отключен'),
            }

            const client = await connectYouTubeClient(
                { videoId: youtubeVideoId, accessToken: youtubeAccessToken },
                callbacks
            )

            if (client) youtubeClientRef.current = client
        } catch (error) {
            console.error('Ошибка подключения к YouTube:', error)
        }
    }

    useEffect(() => {
        handleTwitchConnect()
        handleYouTubeConnect()
        setTheme(targetTheme)
    }, [])

    return (
        <div className={s.wrapper}>
            <TTSChat volume={voiceVolume} twitchVoiceProp={twitchVoice} />
            <LiveChat backgroundColor={'transparent'} isWidget />
        </div>
    )
}
