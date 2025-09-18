import { DefaultOption } from '../../../shared/ui'
import { ThemeSwitch } from '../../../shared/ui/switches/ThemeSwitch/ThemeSwitch'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './SettingsPage.module.scss'

export const SettingsPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} paddingBlock={'16px'} title='Настройки'>
                <DefaultOption name={'Темная тема'}>
                    <ThemeSwitch />
                </DefaultOption>
            </DefaultWidgetShape>
        </div>
    )
}