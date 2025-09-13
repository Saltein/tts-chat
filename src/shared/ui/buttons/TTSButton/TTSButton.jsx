// TTSButton.jsx
import { useState } from "react";

export const TTSButton = () => {
    const [audioUrl, setAudioUrl] = useState(null);

    const handleSpeak = async () => {
        try {
            const res = await fetch("http://localhost:5001/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: "Привет! Это тестовая озвучка." }),
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
        <div>
            <button onClick={handleSpeak}>Озвучить текст</button>
            {audioUrl && <audio controls autoPlay src={audioUrl} />}
        </div>
    );
};
