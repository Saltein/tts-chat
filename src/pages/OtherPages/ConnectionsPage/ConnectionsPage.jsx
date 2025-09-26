import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import { setTwitchChatChannelName, setYoutubeVideoId } from '../../../entities/connection/model/slice'

export const ConnectionsPage = () => {
    const twitchInputs = [
        {
            name: 'chatChannelName',
            placeholder: 'Название канала',
            info: 'Название канала twitch',
            type: 'text',
        },
    ]

    const youtubeInputs = [
        {
            name: 'youtubeVideoId',
            placeholder: 'ID прямой трансляции YouTube',
            info: (
                <div>
                    <p>ID можно найти в ссылке на стрим после символа "v=", например:</p>
                    <span style={{opacity: 0.7}}>"https://www.youtube.com/watch?v=</span><b style={{opacity: 1}}>dQw4w9WgXcQ</b><span>"</span>
                </div>
            ),
            type: 'text',
        },
        {
            name: 'apiKey',
            placeholder: 'API Key',
            info: 'API ключ',
            type: 'password',
        },
    ]

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} title='Подключения'>
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} inputs={twitchInputs} title={'Twitch'} dispatcher={setTwitchChatChannelName} />
                    <ConnectionCard IconComponent={YoutubeIcon} inputs={youtubeInputs} title={'YouTube'} dispatcher={setYoutubeVideoId} isActive={false} />
                    <ConnectionCard IconComponent={VkVideoIcon} />
                </div>
            </DefaultWidgetShape>
        </div>
    )
}