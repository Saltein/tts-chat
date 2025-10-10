import { useEffect, useState } from 'react'
import { DefaultButton, DefaultInput, DefaultTitle } from '../../../shared/ui'
import s from './ChatSettings.module.scss'
import { useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchVoice } from '../../../features/tts-chat/model/slice'
import { selectTwitchConnectionData, selectTwitchConnectionStatus, selectYoutubeAccessToken, selectYoutubeConnectionStatus, selectYoutubeVideoId } from '../../../entities/connection/model/slice'
import { convertObjToStr } from '../../../shared/lib/convertObjToStr'

export const ChatSettings = () => {
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)

    const currentTheme = localStorage.getItem('theme')
    const volume = useSelector(selectSpeechVolume) / 100
    const twitchVoice = useSelector(selectTwitchVoice)

    const twitchChatChannelName = useSelector(selectTwitchConnectionData)?.chatChannelName
    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)

    const youtubeVideoId = useSelector(selectYoutubeVideoId)?.youtubeVideoId
    const youtubeAccessToken = useSelector(selectYoutubeAccessToken)
    const youtubeConnectionStatus = useSelector(selectYoutubeConnectionStatus)

    const generalQueryParamObj = {
        'theme': currentTheme,
        'volume': volume,
    }
    const twitchQueryParamObj = {
        'twitchChatChannelName': twitchChatChannelName,
        'twitchConnectionStatus': twitchConnectionStatus,
        'twitchVoice': twitchVoice,
    }
    const youtubeQueryParamObj = {
        'youtubeVideoId': youtubeVideoId,
        'youtubeAccessToken': youtubeAccessToken,
        'youtubeConnectionStatus': youtubeConnectionStatus,
    }

    const baseUrl = process.env.REACT_APP_BASE_URL_WIDGET || ''

    useEffect(() => {
        console.error('youtubeVideoId, youtubeAccessToken, youtubeConnectionStatus', {youtubeVideoId, youtubeAccessToken, youtubeConnectionStatus})
        setLink(`${baseUrl}/widget/chat?${convertObjToStr([generalQueryParamObj, twitchQueryParamObj, youtubeQueryParamObj])}`)
    }, [baseUrl, twitchChatChannelName, volume, twitchConnectionStatus, twitchVoice, currentTheme])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Ошибка при копировании: ", err)
        }
    }

    return (
        <div className={s.wrapper}>
            <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'URL виджета'} titleStyles={{ fontSize: '1rem' }} />
            <DefaultInput
                width={'100%'}
                info={'Скопируйте и вставьте эту ссылку в браузерный плагин стримингового ПО или запустите её через браузер.'}
                value={link}
            />
            <DefaultButton title={copied ? 'Скопировано' : 'Скопировать ссылку'} onClick={handleCopy} active={copied ? false : true} />
        </div>
    )
}