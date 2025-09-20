import { useEffect, useRef, useState } from 'react'
import { selectSpeechVolume, selectTwitchTTSOn, selectTwitchVoice } from '../model/slice'
import s from './TTSChat.module.scss'
import { useSelector } from 'react-redux'
import { selectLastTwitchMessage } from '../../../entities/connection/model/slice'
import { transliterateMessage } from '../../live-chat/lib/transliteration'

export const TTSChat = ({ volume, twitchVoiceProp }) => {
    let currentVolume = useSelector(selectSpeechVolume) / 100
    if (volume) currentVolume = volume
    const message = useSelector(selectLastTwitchMessage)[0]
    const isTwitchTTSOn = useSelector(selectTwitchTTSOn)
    let twitchVoice = useSelector(selectTwitchVoice)
    if (twitchVoiceProp) twitchVoice = twitchVoiceProp

    const [audioUrl, setAudioUrl] = useState(null)
    const audioRef = useRef(null);

    const handleSpeak = async () => {
        if (message) {
            if (message?.tags['reply-parent-user-login']) return
            try {
                console.log('twitchVoice', twitchVoice)
                const res = await fetch("http://localhost:5001/api/speak", { // ПОМЕНЯТЬ НА ПРОДАКШЕНЕ НА /api/speak
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: transliterateMessage(message?.message),
                        speaker: twitchVoice
                    }),
                })

                if (!res.ok) {
                    const error = await res.json()
                    console.error("Ошибка TTS:", error)
                    return
                }

                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
            } catch (err) {
                console.error("Ошибка запроса к TTS серверу:", err)
            }
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = currentVolume;
        }
    }, [currentVolume, audioUrl]);

    useEffect(() => {
        handleSpeak()
    }, [message])

    return (
        <div className={s.wrapper}>
            {isTwitchTTSOn &&
                <audio
                    ref={audioRef}
                    controls
                    autoPlay
                    src={audioUrl}
                    style={{ width: "100%" }}
                />
            }
        </div>
    )
}