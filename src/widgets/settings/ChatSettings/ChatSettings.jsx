import { useEffect, useState } from 'react'
import { DefaultButton, DefaultDivider, DefaultInput, DefaultSlider, DefaultTitle } from '../../../shared/ui'
import s from './ChatSettings.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchVoice } from '../../../features/tts-chat/model/slice'
import { selectTwitchConnectionData, selectTwitchConnectionStatus, selectYoutubeAccessToken, selectYoutubeConnectionStatus, selectYoutubeVideoId } from '../../../entities/connection/model/slice'
import { convertObjToStr } from '../../../shared/lib/convertObjToStr'
import { selectMessageBackground, selectMessageBackgroundOpacity, setMessageBackground, setMessageBackgroundOpacity } from '../../../entities/message/model/slice'
import { hexToRgbString, rgbStringToHex } from '../../../shared/lib/hexToRgbString'

export const ChatSettings = () => {
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)

    const dispatch = useDispatch()

    const currentMessageBackgroundColor = useSelector(selectMessageBackground)
    const currentMessageBackgroundOpacity = useSelector(selectMessageBackgroundOpacity)

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
    const chatCustomizationQueryParamObj = {
        'messageBackgroundColor': currentMessageBackgroundColor,
        'messageBackgroundOpacity': currentMessageBackgroundOpacity,
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
    const queryParamList = [generalQueryParamObj, chatCustomizationQueryParamObj, twitchQueryParamObj, youtubeQueryParamObj]

    useEffect(() => {
        // console.error('youtubeVideoId, youtubeAccessToken, youtubeConnectionStatus', { youtubeVideoId, youtubeAccessToken, youtubeConnectionStatus })
        setLink(`${baseUrl}/widget/chat?${convertObjToStr(queryParamList)}`)
    }, queryParamList)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Ошибка при копировании: ", err)
        }
    }

    const handlePickColor = (e) => {
        dispatch(setMessageBackground(hexToRgbString(e.target.value)))
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


            <DefaultDivider />


            <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Сообщения'} titleStyles={{ fontSize: '1rem' }} />
            <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Цвет фона'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
            <input className={s.colorPicker} value={rgbStringToHex(currentMessageBackgroundColor)} type='color' onChange={handlePickColor} />


            <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Прозрачность фона'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
            <DefaultSlider selector={selectMessageBackgroundOpacity} dispatcher={setMessageBackgroundOpacity} width='100%' height='32px' isCoefficient />
        </div>
    )
}