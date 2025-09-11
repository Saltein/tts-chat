import { useSelector } from 'react-redux'
import s from './LiveChat.module.scss'
import { selectLast50TwitchMessages } from '../../../../entities/connection/model/slice'
import { ChatMessage } from '../ChatMessage/ChatMessage'

export const LiveChat = () => {
    const messages = useSelector(selectLast50TwitchMessages)

    return (
        <div className={s.wrapper}>
            {messages.map((item, index) => {
                return (
                    <ChatMessage key={item.id || index} message={item} />
                )
            })}
        </div>
    )
}