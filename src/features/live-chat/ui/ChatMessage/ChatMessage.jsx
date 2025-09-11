import s from './ChatMessage.module.scss'

export const ChatMessage = ({ message }) => {
    const styles = {
        color: message.tags["color"]
    }

    return (
        <div className={s.wrapper}>
            <span className={s.name} style={styles}>
                {message.tags["display-name"]}
            </span>
            <span className={s.message}>
                {message.message}
            </span>
        </div>
    )
}