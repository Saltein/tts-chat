import s from './LobbyBlock.module.scss'
import WebSocketRoom from './WebSocketRoom'

export const LobbyBlock = () => {
    return (
        <div className={s.wrapper}>
            <WebSocketRoom />
        </div>
    )
}