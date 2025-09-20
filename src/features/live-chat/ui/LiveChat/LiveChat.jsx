import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import s from './LiveChat.module.scss'
import { selectLast50TwitchMessages } from '../../../../entities/connection/model/slice'
import { ChatMessage } from '../ChatMessage/ChatMessage'

export const LiveChat = ({ backgroundColor, isWidget }) => {
    const messages = useSelector(selectLast50TwitchMessages)
    const chatEndRef = useRef(null)

    const styles = {
        backgroundColor: backgroundColor ?? undefined,
        height: isWidget ? '100vh' : ''
    }

    useEffect(() => {
        // Прокрутка вниз при добавлении нового сообщения
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className={s.wrapper} style={styles}>
            <ChatMessage
                message={{
                    message: 'Так будут выглядеть сообщения из чата',
                    tags: {
                        'display-name': 'TTS Chat',
                        'color': 'var(--color-accent)'
                    }
                }}
            />
            {messages.map((item, index) => (
                <ChatMessage key={item.id || index} message={item} />
            ))}
            <div ref={chatEndRef} className={s.anchor}/>
        </div>
    )
}
