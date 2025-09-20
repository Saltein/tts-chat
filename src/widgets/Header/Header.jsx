import s from './Header.module.scss'

export const Header = () => {
    return (
        <header className={s.header}>
            <div className={s.logo}>
                <h1 className={s.h1}>TTS Chat</h1>
                <p className={s.p}>Сервис для озвучки чата</p>
            </div>
        </header>
    )
}