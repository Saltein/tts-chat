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

export const ChatWidget = () => {
    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN

    const [searchParams] = useSearchParams()
    const clientRef = useRef(null)
    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()

    const voiceVolume = searchParams.get('volume') || 1
    const twitchVoice = searchParams.get('twitchVoice') || 'random'
    const targetTheme = searchParams.get('theme') || 'dark'

    const twitchChatChannelName = searchParams.get('twitchChatChannelName') || ''
    const twitchConnectionStatus = searchParams.get('twitchConnectionStatus') === 'true' || false

    const youtubeVideoId = searchParams.get('youtubeVideoId') || ''
    const youtubeAccessToken = searchParams.get('youtubeAccessToken') || ''
    const youtubeConnectionStatus = searchParams.get('youtubeConnectionStatus') === 'true' || false

    console.warn('Переданные параметры: ', voiceVolume, twitchVoice, targetTheme, twitchChatChannelName, twitchConnectionStatus, youtubeVideoId, youtubeAccessToken, youtubeConnectionStatus)

    const handleTwitchConnect = () => {
        if (twitchConnectionStatus) {
            console.warn('twitchBotToken в виджете', { twitchBotToken, twitchBotName, twitchChatChannelName })
            const client = connectTwitchClient({
                token: twitchBotToken,
                botNick: twitchBotName,
                channel: twitchChatChannelName,
            })

            if (client) {
                clientRef.current = client
                client.on("message", (channel, tags, message, self) => {
                    dispatch(setNewTwitchMessage({
                        channel: channel,
                        tags: tags,
                        message: message,
                        self: self,
                    }))
                })
            }
        }
    }

    const handleYouTubeConnect = async () => {
        if (youtubeConnectionStatus && youtubeVideoId && youtubeAccessToken) {
            try {
                const callbacks = {
                    onChatMessage: (msg) => {
                        dispatch(setNewYoutubeMessage(msg))
                    },
                    onConnected: () => {
                        console.log('✅ YouTube чат подключен')
                    },
                    onDisconnected: () => {
                        console.log('❌ YouTube чат отключен')
                    }
                }

                const client = await connectYouTubeClient(
                    { videoId: youtubeVideoId, accessToken: youtubeAccessToken },
                    callbacks
                )

                if (client) {
                    clientRef.current.youtube = client
                }
            } catch (error) {
                console.error('Ошибка подключения к YouTube:', error)
            }
        }
    }

    useEffect(() => {
        if (twitchConnectionStatus) handleTwitchConnect()
        if (youtubeConnectionStatus) handleYouTubeConnect()
        setTheme(targetTheme)
    }, [twitchConnectionStatus, youtubeConnectionStatus, targetTheme])

    return (
        <div className={s.wrapper}>
            <TTSChat volume={voiceVolume} twitchVoiceProp={twitchVoice} />
            <LiveChat backgroundColor={'transparent'} isWidget />
        </div>
    )
}