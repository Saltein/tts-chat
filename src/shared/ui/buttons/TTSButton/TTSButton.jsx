// TTSButton.jsx
import { useState, useRef, useEffect } from "react";
import { selectSpeechVolume } from "../../../../features/tts-chat/model/slice";
import { useSelector } from "react-redux";

export const TTSButton = () => {
    const currentValue = useSelector(selectSpeechVolume) / 100

    const [audioUrl, setAudioUrl] = useState(null);
    const audioRef = useRef(null);

    // Обновляем громкость аудио при изменении volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = currentValue;
        }
    }, [currentValue, audioUrl]);

    const handleSpeak = async () => {
        try {
            const res = await fetch("http://localhost:5001/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: "Привет! Это тестовая озвучка.",
                    speaker: "random"
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Ошибка TTS:", error);
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (err) {
            console.error("Ошибка запроса к TTS серверу:", err);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
            <button onClick={handleSpeak}>Озвучить текст</button>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <audio
                    ref={audioRef}
                    controls
                    autoPlay
                    src={audioUrl}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    );
};