import { useState, useRef } from "react"
import s from "./ConnectionSwitch.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { selectTwitchConnectionData, selectTwitchConnectionStatus, setNewTwitchMessage, setTwitchConnectionStatus } from "../../../../entities/connection/model/slice"
import { connectTwitchClient, disconnectTwitchClient } from "../../../../features/live-chat/lib/twitchClientSingleton"

export const ConnectionSwitch = ({ serviceName = "" }) => {
    const dispatch = useDispatch()

    const twitchBotName = process.env.REACT_APP_TWITCH_BOT_NAME
    const twitchBotToken = process.env.REACT_APP_TWITCH_BOT_TOKEN

    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)
    const [isSwitchOn, setIsSwitchOn] = useState(serviceName === 'Twitch' && twitchConnectionStatus)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { chatChannelName } = useSelector(
        selectTwitchConnectionData
    )

    const clientRef = useRef(null)

    const handleConnect = () => {
        if (isSwitchOn) {
            disconnectTwitchClient()
            setIsSwitchOn(false)
            dispatch(setTwitchConnectionStatus(false))
            setIsSwitchLoading(false)
        } else {
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
        }
    }

    return (
        <div
            className={`${s.wrapper} ${isSwitchLoading ? s.loading : ""} ${isSwitchOn ? s.on : ""}`}
            onClick={handleConnect}
        >
            <div className={s.switch} />
        </div>
    );
};
