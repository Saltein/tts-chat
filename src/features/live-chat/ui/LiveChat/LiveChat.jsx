import { useSelector } from 'react-redux'
import s from './LiveChat.module.scss'
import { selectLast50TwitchMessages } from '../../../../entities/connection/model/slice'
import { ChatMessage } from '../ChatMessage/ChatMessage'

export const LiveChat = ({ backgroundColor, isWidget }) => {
    const messages = useSelector(selectLast50TwitchMessages)

    const styles = {
        backgroundColor: backgroundColor ?? undefined,
        height: isWidget ? '100vh' : ''
    }

    return (
        <div className={s.wrapper} style={styles}>
            {messages.map((item, index) => {
                return (
                    <ChatMessage key={item.id || index} message={item} />
                )
            })}
        </div>
    )
}