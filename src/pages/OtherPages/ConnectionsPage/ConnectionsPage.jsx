import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import { DefaultTitle } from '../../../shared/ui'

export const ConnectionsPage = () => {
    const twitchInputs = [
        {
            placeholder: 'Название вашего канала',
            info: 'Название вашего канала на twitch'
        },
        {
            placeholder: 'Название канала чата',
            info: 'Название канала, чат которого нужно прослушивать'
        },
        {
            placeholder: 'Access token',
            info: <span>Access Token с сайта <a className={s.href} href='https://twitchtokengenerator.com/'>twitchtokengenerator.com</a> (Bot Chat Token)</span>
        },
    ]

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'}>
                <DefaultTitle title={'Подключения'} />
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} inputs={twitchInputs} />
                    <ConnectionCard IconComponent={YoutubeIcon} />
                    <ConnectionCard IconComponent={VkVideoIcon} />
                </div>
            </DefaultWidgetShape>
        </div>
    )
}