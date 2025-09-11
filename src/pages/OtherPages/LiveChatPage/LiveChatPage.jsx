import { LiveChat } from '../../../features/live-chat/ui/LiveChat/LiveChat'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './LiveChatPage.module.scss'

export const LiveChatPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} title='Чат' paddingBlock={'16px'}>
                <LiveChat />
            </DefaultWidgetShape>
        </div>
    )
}