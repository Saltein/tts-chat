import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import s from './LiveChat.module.scss'
import { selectLast50Messages } from '../../../../entities/connection/model/slice'
import { ChatMessage } from '../ChatMessage/ChatMessage'
import { selectMessageGap, selectMessageLifeTime } from '../../../../entities/message/model/slice'
import WebSocketRoom from '../../../ws-lobby/ui/LobbyBlock/WebSocketRoom'

export const LiveChat = ({ backgroundColor, isWidget }) => {
    const messages = useSelector(selectLast50Messages)
    const messageGap = useSelector(selectMessageGap)
    const chatEndRef = useRef(null)

    const timeBeforeDisappear = useSelector(selectMessageLifeTime)

    const styles = {
        backgroundColor: backgroundColor ?? undefined,
        height: isWidget ? '100vh' : '',
        gap: messageGap + 'px' ?? undefined,
    }

    useEffect(() => {
        // Прокрутка вниз при добавлении нового сообщения
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className={s.wrapper} style={styles}>
            {isWidget && <WebSocketRoom inWidget />}
            <ChatMessage
                message={{
                    message: 'Так будут выглядеть сообщения из чата',
                    tags: {
                        'display-name': 'TTS Chat',
                        'color': 'var(--color-accent)'
                    },
                    time: Date.now(),
                    service: 'ttschat',
                }}
                timeBeforeDisappear={timeBeforeDisappear}
            />
            {messages.map((item, index) => {
                return (
                    <ChatMessage key={item.time + item.message} message={item} timeBeforeDisappear={timeBeforeDisappear} />
                )
            })}
            <div ref={chatEndRef} className={s.anchor} />
        </div>
    )
}
