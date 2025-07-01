import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import { DefaultTitle } from '../../../shared/ui'

export const ConnectionsPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'}>
                <DefaultTitle title={'Подключения'} />
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} />
                    <ConnectionCard IconComponent={YoutubeIcon} />
                    <ConnectionCard IconComponent={VkVideoIcon} />
                </div>
            </DefaultWidgetShape>
        </div>
    )
}