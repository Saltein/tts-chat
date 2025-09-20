import { useSearchParams } from 'react-router-dom'
import { LiveChat } from '../../../features/live-chat/ui/LiveChat/LiveChat'
import s from './ChatWidget.module.scss'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { connectTwitchClient } from '../../../features/live-chat/lib/twitchClientSingleton'
import { setNewTwitchMessage } from '../../../entities/connection/model/slice'
import { TTSChat } from '../../../features/tts-chat/TTSChat/TTSChat'
import { useTheme } from '../../../shared/context/theme/ThemeContext'

export const ChatWidget = () => {
    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN

    const [searchParams] = useSearchParams()
    const clientRef = useRef(null)
    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()

    const twitchChatChannelName = searchParams.get('twitchChatChannelName') || ''
    const voiceVolume = searchParams.get('volume') || 1
    const twitchConnectionStatus = searchParams.get('twitchConnectionStatus') || false
    const twitchVoice = searchParams.get('twitchVoice') || 'random'
    const targetTheme = searchParams.get('theme') || 'dark'

    const handleConnect = () => {
        if (twitchConnectionStatus) {
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

    useEffect(() => {
        handleConnect()
        setTheme(targetTheme)
    }, [])

    return (
        <div className={s.wrapper}>
            <TTSChat volume={voiceVolume} twitchVoiceProp={twitchVoice} />
            <LiveChat backgroundColor={'transparent'} isWidget />
        </div>
    )
}