import { useState, useRef } from "react"
import s from "./ConnectionSwitch.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { connectTwitchChat } from "../../../../features/live-chat/lib/twitchClient"
import { selectTwitchConnectionData, selectTwitchConnectionStatus, setNewTwitchMessage, setTwitchConnectionStatus } from "../../../../entities/connection/model/slice"

export const ConnectionSwitch = ({ serviceName = "" }) => {
    const dispatch = useDispatch()
    
    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)
    const [isSwitchOn, setIsSwitchOn] = useState(serviceName === 'Twitch' && twitchConnectionStatus)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { accessToken, channelName, chatChannelName } = useSelector(
        selectTwitchConnectionData
    )

    const clientRef = useRef(null)

    const handleConnect = () => {
        if (isSwitchOn) {
            // Выключение
            if (clientRef.current) {
                clientRef.current.disconnect()
                console.log('DISCONNECTED')
                clientRef.current = null
            }
            setIsSwitchOn(false)
            dispatch(setTwitchConnectionStatus(false))
            setIsSwitchLoading(false)
        } else {
            // Включение
            if (serviceName === "Twitch") {
                setIsSwitchLoading(true)

                // Подключение к Twitch
                const client = connectTwitchChat({
                    token: accessToken,
                    botNick: channelName,
                    channel: chatChannelName || channelName,
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
                        dispatch(setTwitchConnectionStatus(true))
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
