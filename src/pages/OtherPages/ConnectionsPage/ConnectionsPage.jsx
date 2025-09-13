import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import { setAllTwitchData } from '../../../entities/connection/model/slice'
import { TTSButton } from '../../../shared/ui/buttons/TTSButton/TTSButton'

export const ConnectionsPage = () => {
    const twitchInputs = [
        {
            name: 'channelName',
            placeholder: 'Название бота',
            info: 'Название вашего бота или второго аккаунта twitch, который будет читать чат',
            type: 'text',
        },
        {
            name: 'chatChannelName',
            placeholder: 'Название канала',
            info: 'Название канала twitch, чат которого нужно прослушивать',
            type: 'text',
        },
        {
            name: 'accessToken',
            placeholder: 'Access token',
            info: <span>Access Token с сайта <a className={s.href} href='https://twitchtokengenerator.com/'>twitchtokengenerator.com</a> (Bot Chat Token)</span>,
            type: 'password',
        },
    ]

    const onMistakeTwitch = (botName, channelName) => {
        if (botName === channelName) {
            return <span>Имя <b>бота</b> и имя <b>канала</b> не должны совпадать</span>
        }
        else {
            return ''
        }
    }

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} title='Подключения'>
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} inputs={twitchInputs} title={'Twitch'} dispatcher={setAllTwitchData} onMistake={onMistakeTwitch}/>
                    <ConnectionCard IconComponent={YoutubeIcon} />
                    <ConnectionCard IconComponent={VkVideoIcon} />
                </div>
            </DefaultWidgetShape>
        </div>
    )
}