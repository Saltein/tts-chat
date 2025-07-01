import { NavButton } from '../../../shared/buttons/NavButton/NavButton'
import { ThemeSwitch } from '../../../shared/switches/ThemeSwitch/ThemeSwitch'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './NavPanel.module.scss'

export const NavPanel = () => {
    return (
        <DefaultWidgetShape width={'256px'} height={'fit-content'} gap={'8px'}>
            <span className={s.name}>TTS Chat</span>
            <div className={s.buttons}>
                <NavButton title={'Мультичат'} index={0} link='/multi-chat'/>
                <NavButton title={'Озвучка чата'} index={1} link='/tts'/>
                <NavButton title={'Подключения'} index={2} link='/connections'/>
                <NavButton title={'Настройки'} index={3} link='/settings'/>

                <ThemeSwitch />
            </div>
        </DefaultWidgetShape>
    )
}