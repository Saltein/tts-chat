import { LiveChat } from '../../../features/live-chat/ui/LiveChat/LiveChat'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ChatSettings } from '../../../widgets/settings/ChatSettings/ChatSettings'
import s from './LiveChatPage.module.scss'

export const LiveChatPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'}
                padding={'0'} title='Чат' paddingBlock={'16px'} flex={3} overflowBlock={'hidden'}
            >
                <LiveChat />
            </DefaultWidgetShape>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} title='Настройки чата'
                paddingBlock={'16px'} flex={1} height={'fit-content'}>
                <ChatSettings />
            </DefaultWidgetShape>
        </div>
    )
}