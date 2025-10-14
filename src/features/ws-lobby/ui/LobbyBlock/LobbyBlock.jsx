import { DefaultButton, DefaultInput, DefaultTitle } from '../../../../shared/ui'
import s from './LobbyBlock.module.scss'
import WebSocketRoom from './WebSocketRoom'

export const LobbyBlock = () => {
    return (
        <div className={s.wrapper}>
            {/* <DefaultButton title={'Создать'} width={'144px'} />
            <DefaultButton title={'Подключиться'} width={'144px'} /> */}
            {/* <DefaultInput width={'144px'} /> */}

            <WebSocketRoom />
        </div>
    )
}