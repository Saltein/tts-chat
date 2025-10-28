import { useState, useRef, useEffect } from "react"
import s from "./ConnectionSwitch.module.scss"
import { useDispatch, useSelector } from "react-redux"
import {
    selectTwitchConnectionData,
    selectTwitchConnectionStatus,
    setTwitchConnectionStatus,
    setNewTwitchMessage,

    selectYoutubeVideoId,
    selectYoutubeAccessToken,
    setYoutubeConnectionStatus,
    setNewYoutubeMessage,

    setVkConnectionStatus,
    setNewVkMessage,
    selectVkConnectionData,
} from "../../../../entities/connection/model/slice"
import { connectTwitchClient, disconnectTwitchClient } from "../../../../features/live-chat/lib/twitchClientSingleton"
import { connectVkPlayClient } from "../../../../features/live-chat/lib/vk/vkClientSingleton"
import { connectYouTubeClient, disconnectYouTubeClient, getYouTubeClient } from "../../../../features/live-chat/lib/youtube/youtubeClientSingleton"
import { convertUrlToIdYoutube } from "../../../lib/convertUrlToIdYoutube"

export const ConnectionSwitch = ({ serviceName = "", isActive = true }) => {
    const dispatch = useDispatch()

    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN
    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)
    const chatChannelName = useSelector(selectTwitchConnectionData)

    const vkConnectionData = useSelector(selectVkConnectionData)

    const youtubeVideoId = useSelector(selectYoutubeVideoId)
    const youtubeAccessToken = useSelector(selectYoutubeAccessToken)
    const [isSwitchOn, setIsSwitchOn] = useState(serviceName === 'Twitch' && twitchConnectionStatus)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const clientRef = useRef(null)

    // Эффект для синхронизации состояния переключателя с реальным статусом подключения
    useEffect(() => {
        if (serviceName === "YouTube") {
            const youtubeClient = getYouTubeClient();
            const isYoutubeConnected = youtubeClient && youtubeClient.isConnected;

            if (isYoutubeConnected !== isSwitchOn) {
                setIsSwitchOn(isYoutubeConnected);
                setIsSwitchLoading(false);
            }
        }
    }, [serviceName, isSwitchOn]);

    const handleConnect = async () => {
        if (isSwitchOn) {
            // Отключение
            if (serviceName === "Twitch") { // Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch Twitch
                disconnectTwitchClient();
                setIsSwitchOn(false);
                dispatch(setTwitchConnectionStatus(false));
                setIsSwitchLoading(false);
            }
            else if (serviceName === "VK Видео Live") {
                // Для VK нужно добавить функцию отключения в vkClientSingleton
                setIsSwitchOn(false);
                dispatch(setVkConnectionStatus(false));
                setIsSwitchLoading(false);
            }
            else if (serviceName === "YouTube") {
                setIsSwitchLoading(true);
                disconnectYouTubeClient();
                setIsSwitchOn(false);
                dispatch(setYoutubeConnectionStatus(false));
                setIsSwitchLoading(false);
            }
        } else {
            // Включение
            if (serviceName === "Twitch") {
                setIsSwitchLoading(true);
                dispatch(setTwitchConnectionStatus(true));
                console.warn('twitchBotToken на сайте', twitchBotToken)

                const client = connectTwitchClient({
                    token: twitchBotToken,
                    botNick: twitchBotName,
                    channel: chatChannelName,
                })

                if (client) {
                    clientRef.current = client;

                    client.on("message", (channel, tags, message, self) => {
                        console.log('tags: ', tags);
                        console.log('message: ', message);
                        dispatch(setNewTwitchMessage({
                            channel: channel,
                            tags: tags,
                            message: message,
                            self: self,
                        }));
                    });

                    client.on("connected", () => {
                        setIsSwitchOn(true);
                        setIsSwitchLoading(false);
                    });

                    client.on("disconnected", () => {
                        setIsSwitchOn(false);
                        dispatch(setTwitchConnectionStatus(false));
                        setIsSwitchLoading(false);
                    });
                } else {
                    setIsSwitchLoading(false);
                }
            }
            else if (serviceName === "VK Видео Live") { // VK Видео Live VK Видео Live VK Видео Live VK Видео Live VK Видео Live VK Видео Live VK Видео Live VK Видео Live VK Видео Live
                setIsSwitchLoading(true)
                dispatch(setVkConnectionStatus(true))

                const callbacks = {
                    onChatMessage: (msg) => {
                        console.log("💬 VK Play сообщение:", msg)
                        dispatch(setNewVkMessage(msg))
                    },
                    onConnected: () => {
                        setIsSwitchOn(true)
                        setIsSwitchLoading(false)
                    },
                    onDisconnected: () => {
                        setIsSwitchOn(false)
                        dispatch(setVkConnectionStatus(false))
                        setIsSwitchLoading(false)
                    }
                };

                const client = connectVkPlayClient({
                    channelId: vkConnectionData?.vkChannelId,
                    token: vkConnectionData?.token,
                }, callbacks);

                if (!client) {
                    setIsSwitchLoading(false);
                    dispatch(setVkConnectionStatus(false));
                }
            }
            else if (serviceName === "YouTube") { // YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube YouTube
                setIsSwitchLoading(true);
                dispatch(setYoutubeConnectionStatus(true));

                const callbacks = {
                    onChatMessage: (msg) => {
                        console.log("💬 YouTube сообщение:", msg);
                        dispatch(setNewYoutubeMessage(msg));
                    },
                    onConnected: () => {
                        setIsSwitchOn(true);
                        setIsSwitchLoading(false);
                        dispatch(setYoutubeConnectionStatus(true));
                    },
                    onDisconnected: () => {
                        setIsSwitchOn(false);
                        setIsSwitchLoading(false);
                        dispatch(setYoutubeConnectionStatus(false));
                    },
                };

                try {
                    console.log("Подключение YouTube с параметрами:", {
                        accessToken: youtubeAccessToken,
                        videoId: convertUrlToIdYoutube(youtubeVideoId?.youtubeVideoId),
                    });

                    const client = await connectYouTubeClient({
                        accessToken: youtubeAccessToken,
                        videoId: convertUrlToIdYoutube(youtubeVideoId?.youtubeVideoId),
                    }, callbacks);

                    if (client) {
                        clientRef.current = client;
                        console.log("✅ YouTube клиент успешно создан");
                    } else {
                        console.error("❌ Не удалось создать YouTube клиент");
                        setIsSwitchLoading(false);
                        dispatch(setYoutubeConnectionStatus(false));
                    }
                } catch (error) {
                    console.error("❌ Ошибка подключения YouTube:", error);
                    setIsSwitchLoading(false);
                    dispatch(setYoutubeConnectionStatus(false));
                }
            }
        }
    }

    return (
        <div
            className={`${s.wrapper} ${isSwitchLoading ? s.loading : ""} ${isSwitchOn ? s.on : ""}`}
            onClick={isActive ? handleConnect : () => { }}
        >
            <div className={s.switch} />
        </div>
    );
};