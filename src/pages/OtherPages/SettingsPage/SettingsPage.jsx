import { ThemeSwitch } from '../../../shared/ui/switches/ThemeSwitch/ThemeSwitch'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './SettingsPage.module.scss'

export const SettingsPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'16px'}>
                <span>Темная тема</span><ThemeSwitch />
            </DefaultWidgetShape>
        </div>
    )
}