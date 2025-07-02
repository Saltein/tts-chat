import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import { DefaultTitle } from '../../../shared/ui'
import { setAllTwitchData } from '../../../entities/connection/model/slice'
import { useDispatch } from 'react-redux'

export const ConnectionsPage = () => {
    const twitchInputs = [
        {
            name: 'channelName',
            placeholder: 'Название вашего канала',
            info: 'Название вашего канала на twitch',
            type: 'text',
        },
        {
            name: 'chatChannelName',
            placeholder: 'Название канала чата',
            info: 'Название канала, чат которого нужно прослушивать',
            type: 'text',
        },
        {
            name: 'accessToken',
            placeholder: 'Access token',
            info: <span>Access Token с сайта <a className={s.href} href='https://twitchtokengenerator.com/'>twitchtokengenerator.com</a> (Bot Chat Token)</span>,
            type: 'password',
        },
    ]

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'}>
                <DefaultTitle title={'Подключения'} />
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} inputs={twitchInputs} title={'Twitch'} dispatcher={setAllTwitchData} />
                    <ConnectionCard IconComponent={YoutubeIcon} />
                    <ConnectionCard IconComponent={VkVideoIcon} />
                </div>
            </DefaultWidgetShape>
        </div>
    )
}