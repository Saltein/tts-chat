import { useState, useRef } from "react"
import s from "./ConnectionSwitch.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { selectTwitchConnectionData, selectTwitchConnectionStatus, setNewTwitchMessage, setNewVkMessage, setTwitchConnectionStatus, setVkConnectionStatus } from "../../../../entities/connection/model/slice"
import { connectTwitchClient, disconnectTwitchClient } from "../../../../features/live-chat/lib/twitchClientSingleton"
import { connectVkPlayClient } from "../../../../features/live-chat/lib/vk/vkClientSingleton"

export const ConnectionSwitch = ({ serviceName = "", isActive = true }) => {
    const dispatch = useDispatch()

    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN

    // ТОКЕН находится в DevTools -> Network -> Socket -> самая первая строчка     ... хз как его найти по другому пока что
    const vkAccessToken = process.env.REACT_APP_TEST_VK_TOKEN

    // ID канала тоже хер пойми как достать кроме как через DevTools -> Network -> Socket
    const vkChannelId = '6256630'

    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)
    const [isSwitchOn, setIsSwitchOn] = useState(serviceName === 'Twitch' && twitchConnectionStatus)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { chatChannelName } = useSelector(
        selectTwitchConnectionData
    )

    const clientRef = useRef(null)

    const handleConnect = () => {
        console.log('VK Видео Live 0')
        if (isSwitchOn) {
            disconnectTwitchClient()
            setIsSwitchOn(false)
            dispatch(setTwitchConnectionStatus(false))
            setIsSwitchLoading(false)
        } else {
            console.log('VK Видео Live 1')
            // Включение
            if (serviceName === "Twitch") {
                setIsSwitchLoading(true)
                dispatch(setTwitchConnectionStatus(true))

                // Подключение к Twitch
                const client = connectTwitchClient({
                    token: twitchBotToken,
                    botNick: twitchBotName,
                    channel: chatChannelName,
                })

                if (client) {
                    clientRef.current = client


                    client.on("message", (channel, tags, message, self) => {
                        // console.log(`[${tags["display-name"]}]: ${message}`)
                        // console.log('channel: ', channel)
                        console.log('tags: ', tags)
                        console.log('message: ', message)
                        // console.log('self: ', self)
                        dispatch(setNewTwitchMessage({
                            channel: channel,
                            tags: tags,
                            message: message,
                            self: self,
                        }))
                    })

                    // Когда подключение успешно → включаем свитч
                    client.on("connected", () => {
                        setIsSwitchOn(true)
                        setIsSwitchLoading(false)
                    })

                    // Если вдруг отключились → выключаем свитч
                    client.on("disconnected", () => {
                        setIsSwitchOn(false)
                        dispatch(setTwitchConnectionStatus(false))
                        setIsSwitchLoading(false)
                    })
                } else {
                    setIsSwitchLoading(false)
                }
            }
            // В компоненте ConnectionSwitch - часть VK
            else if (serviceName === "VK Видео Live") {
                console.log('VK Видео Live 2');
                setIsSwitchLoading(true);
                dispatch(setVkConnectionStatus(true));

                // Колбэки выносим в отдельный объект
                const callbacks = {
                    onChatMessage: (msg) => {
                        console.log("💬 VK Play сообщение:", msg);
                        dispatch(setNewVkMessage(msg));
                    },
                    onConnected: () => {
                        setIsSwitchOn(true);
                        setIsSwitchLoading(false);
                    },
                    onDisconnected: () => {
                        setIsSwitchOn(false);
                        dispatch(setVkConnectionStatus(false));
                        setIsSwitchLoading(false);
                    }
                };

                const client = connectVkPlayClient({
                    channelId: vkChannelId,
                    token: vkAccessToken,
                }, callbacks);

                if (!client) {
                    setIsSwitchLoading(false);
                    dispatch(setVkConnectionStatus(false));
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
