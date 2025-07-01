import { DefaultDivider, DefaultTitle, NavButton } from '../../../shared/ui'
import { ThemeSwitch } from '../../../shared/ui/switches/ThemeSwitch/ThemeSwitch'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './NavPanel.module.scss'

export const NavPanel = () => {
    return (
        <DefaultWidgetShape width={'256px'} height={'fit-content'} backgroundColor={'transparent'} padding={'0'}>
            <DefaultTitle title={'TTS Chat'} />
            <div className={s.buttons}>
                <NavButton title={'Подключения'} index={0} link='/connections' position='first' />
                <NavButton title={'Мультичат'} index={1} link='/multi-chat' />
                <NavButton title={'Озвучка чата'} index={2} link='/tts' />

                <DefaultDivider direction='horizontal' />

                <NavButton title={'Настройки'} index={3} link='/settings' position='last' />

                <ThemeSwitch />
            </div>
        </DefaultWidgetShape>
    )
}