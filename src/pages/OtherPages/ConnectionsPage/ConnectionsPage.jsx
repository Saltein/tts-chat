import s from './ConnectionsPage.module.scss'
import { ConnectionCard } from '../../../entities/connection/ui/ConnectionCard/ConnectionCard'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import { ReactComponent as TwitchIcon } from '../../../shared/assets/icons/twitch-logo.svg'
import { ReactComponent as YoutubeIcon } from '../../../shared/assets/icons/youtube-logo.svg'
import { ReactComponent as VkVideoIcon } from '../../../shared/assets/icons/vk-video-logo.svg'
import {
    selectYoutubeAccessToken,
    setYoutubeVideoId,

    setTwitchChatChannelName,

    setVkConnectionData,
} from '../../../entities/connection/model/slice'
import { useSelector } from 'react-redux'

export const ConnectionsPage = () => {
    const youtubeAccessToken = useSelector(selectYoutubeAccessToken)

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
            placeholder: 'Ссылка на прямую трансляцию или её ID',
            info: (
                <div>
                    <p>Скопируй сюда ссылку на стрим на Youtube или его ID</p>
                    <p>ID можно найти в ссылке на стрим после символа "v=", например:</p>
                    <span style={{ opacity: 0.7 }}>"https://www.youtube.com/watch?v=</span><b style={{ opacity: 1 }}>dQw4w9WgXcQ</b><span>"</span>
                    <p>Но проще вставить ссылку</p>
                </div>
            ),
            type: 'text',
        },
    ]

    const vkInputs = [
        {
            name: 'vkChannelId',
            placeholder: 'ID канала на VK Видео Live',
            info: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3>ID канала сложно найти, но если хочется, то можно)</h3>
                    <div style={{ height: '8px' }} />
                    <p>Войди в свой аккаунт на <b>VK Видео Live</b>, перейди на страницу <b>своего канала</b></p>
                    <div style={{ height: '8px' }} />
                    <p>Открой DevTools, нажав <b>F12</b></p>
                    <p>Перейди во вкладку <b>Network</b> - Выбери фильтр <b>Socket</b> или <b>WS</b></p>
                    <div style={{ height: '8px' }} />
                    <p>Обнови страницу</p>
                    <div style={{ height: '8px' }} />
                    <p>Увидишь строчку <b>websocket?cf_protocol_version=v2</b> или что то похожее - жми</p>
                    <p>Выбирай вкладку <b>Messages</b></p>
                    <p>В колонке Data ищи <b>вторую, третью или любую</b> кроме первой строчки</p>
                    <p>В ней увидишь <b>"channel":"channel-info:12345678"</b> или <b>"channel":"channel-chat:12345678"</b></p>
                    <p>Копируй цифры после <i>channel-info:</i>. Это - <b>ID твоего канала</b></p>
                </div>
            ),
            type: 'text',
        },
        {
            name: 'token',
            placeholder: 'Токен доступа',
            info: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3>Токен найти чуть проще</h3>
                    <div style={{ height: '8px' }} />
                    <p>Войди в свой аккаунт на <b>VK Видео Live</b> - Открой DevTools, нажав <b>F12</b></p>
                    <p>Перейди во вкладку <b>Network</b> - Выбери фильтр <b>Socket</b> или <b>WS</b></p>
                    <div style={{ height: '8px' }} />
                    <p>Обнови страницу</p>
                    <div style={{ height: '8px' }} />
                    <p>Увидишь строчку <b>websocket?cf_protocol_version=v2</b> или что то похожее - жми</p>
                    <p>Выбирай вкладку <b>Messages</b></p>
                    <p>В колонке Data ищи самую первую строчку, в ней увидишь <b>"token":"строка символов"</b></p>
                    <p>Копируй эту строку. Это и есть твой <b>токен</b></p>
                    <div style={{ height: '8px' }} />
                    <i>P.S. Токен никуда <b>не</b> отправляется, он храниться только у тебя в браузере</i>
                </div>
            ),
            type: 'password',
        },
    ]

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} backgroundColor={'transparent'} padding={'0'} title='Подключения'>
                <div className={s.connections}>
                    <ConnectionCard IconComponent={TwitchIcon} inputs={twitchInputs} title={'Twitch'} dispatcher={setTwitchChatChannelName} />
                    <ConnectionCard IconComponent={YoutubeIcon} inputs={youtubeInputs} title={'YouTube'} dispatcher={setYoutubeVideoId}
                        funcActive={(formData) => {
                            if (Object.values(formData)[0] && youtubeAccessToken) {
                                return true
                            }
                            return false
                        }} />
                    <ConnectionCard IconComponent={VkVideoIcon} inputs={vkInputs} title={'VK Видео Live'} dispatcher={setVkConnectionData} isActive={false}/>
                </div>
            </DefaultWidgetShape>
        </div>
    )
}