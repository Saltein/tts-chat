import { DefaultDivider, DefaultTitle, NavButton } from '../../../shared/ui'
import { ThemeSwitch } from '../../../shared/ui/switches/ThemeSwitch/ThemeSwitch'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './NavPanel.module.scss'

export const NavPanel = () => {
    return (
        <DefaultWidgetShape width={'256px'} height={'fit-content'} backgroundColor={'transparent'} padding={'0'}>
            <DefaultTitle title={'TTS Chat'} />
            <div className={s.buttons}>
                <NavButton title={'Мультичат'} index={0} link='/multi-chat' position='first' />
                <NavButton title={'Озвучка чата'} index={1} link='/tts' />
                <NavButton title={'Подключения'} index={2} link='/connections' />

                <DefaultDivider direction='horizontal' />

                <NavButton title={'Настройки'} index={3} link='/settings' position='last' />

                {/* <ThemeSwitch /> */}
            </div>
        </DefaultWidgetShape>
    )
}