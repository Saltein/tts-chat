import { useEffect, useRef, useState } from 'react'
import { selectSpeechVolume } from '../model/slice'
import s from './TTSChat.module.scss'
import { useSelector } from 'react-redux'
import { selectLastTwitchMessage } from '../../../entities/connection/model/slice'

export const TTSChat = () => {
    const currentValue = useSelector(selectSpeechVolume) / 100
    const message = useSelector(selectLastTwitchMessage)[0]

    const [audioUrl, setAudioUrl] = useState(null)
    const audioRef = useRef(null);

    const handleSpeak = async () => {
        if (message) {
            try {
                const res = await fetch("http://localhost:5001/speak", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: message?.message,
                        speaker: "random"
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
            audioRef.current.volume = currentValue;
        }
    }, [currentValue, audioUrl]);

    useEffect(() => {
        handleSpeak()
    }, [message])

    return (
        <div className={s.wrapper}>
            <audio
                ref={audioRef}
                controls
                autoPlay
                src={audioUrl}
                style={{ width: "100%" }}
            />
        </div>
    )
}