import { useEffect, useState } from 'react'
import { DefaultButton, DefaultDivider, DefaultInput, DefaultSlider, DefaultSwitch, DefaultTitle } from '../../../shared/ui'
import s from './ChatSettings.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchVoice } from '../../../features/tts-chat/model/slice'
import { selectTwitchConnectionData, selectTwitchConnectionStatus, selectYoutubeAccessToken, selectYoutubeConnectionStatus, selectYoutubeVideoId } from '../../../entities/connection/model/slice'
import { convertObjToStr } from '../../../shared/lib/convertObjToStr'
import { selectMessageBackground, selectMessageBackgroundOpacity, selectMessageBorder, selectMessageLifeTime, selectMessageTextColor, setMessageBackground, setMessageBackgroundOpacity, setMessageBorder, setMessageLifeTime, setMessageTextColor } from '../../../entities/message/model/slice'
import { hexToRgbString, rgbStringToHex } from '../../../shared/lib/hexToRgbString'

export const ChatSettings = () => {
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)

    const [lifetime, setLifetime] = useState(useSelector(selectMessageLifeTime))
    const [messageBorderLocal, setMessageBorderLocal] = useState(true)

    const dispatch = useDispatch()

    const currentMessageBackgroundColor = useSelector(selectMessageBackground)
    const currentMessageBackgroundOpacity = useSelector(selectMessageBackgroundOpacity)
    const currentMessageTextColor = useSelector(selectMessageTextColor)

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
        'messageTextColor': currentMessageTextColor,
        'messageLifeTime': lifetime,
        'messageBorder': String(messageBorderLocal),
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
        setLink(`${baseUrl}/widget/chat?${convertObjToStr(queryParamList)}`)
    }, queryParamList)

    useEffect(() => {
        console.log('messageBorderLocal', messageBorderLocal)
        dispatch(setMessageBorder(messageBorderLocal))
    }, [messageBorderLocal])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Ошибка при копировании: ", err)
        }
    }

    const handlePickBackgroundColor = (e) => {
        dispatch(setMessageBackground(hexToRgbString(e.target.value)))
    }

    const handlePickTextColor = (e) => {
        dispatch(setMessageTextColor(hexToRgbString(e.target.value)))
    }

    const handleChangeLifeTime = () => {
        dispatch(setMessageLifeTime(lifetime))
    }

    return (
        <div className={s.wrapper}>
            <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'URL виджета'} titleStyles={{ fontSize: '1rem' }} />
            <DefaultInput
                width={'100%'}
                info={'Добавь источник "Браузер" в OBS и вставь туда эту ссылку.'}
                value={link}
                height={'32px'}
            />
            <DefaultButton title={copied ? 'Скопировано' : 'Скопировать ссылку'} onClick={handleCopy} active={copied ? false : true} height='32px' />


            <DefaultDivider />

            <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Сообщения'} titleStyles={{ fontSize: '1rem' }} />

            <div className={s.borderContainer}>
                <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Обводка'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <DefaultSwitch state={messageBorderLocal} onSwitch={setMessageBorderLocal} />
            </div>

            <div className={s.colorContainer}>
                <div className={s.colorPickBlock}>
                    <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                        title={'Цвет фона'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} alignContent={'center'} />
                    <input className={s.colorPicker} value={rgbStringToHex(currentMessageBackgroundColor)} type='color' onChange={handlePickBackgroundColor} />
                </div>
                <div className={s.colorPickBlock}>
                    <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                        title={'Цвет текста'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} alignContent={'center'} />
                    <input className={s.colorPicker} value={rgbStringToHex(currentMessageTextColor)} type='color' onChange={handlePickTextColor} />
                </div>
            </div>

            <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Прозрачность фона'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} alignContent={'center'} />
            <DefaultSlider selector={selectMessageBackgroundOpacity} dispatcher={setMessageBackgroundOpacity} width='100%' height='32px' isCoefficient />

            <DefaultTitle paddingTop={'8px'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                title={'Исчезнут через'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} alignContent={'center'} />
            <div className={s.lifetimeContainer}>
                <DefaultInput placeholder='Время в секундах' height={'32px'} value={lifetime / 1000} align={'center'} width={'48px'} onChange={(e) => {
                    const value = e.target.value
                    // Если поле пустое, устанавливаем 0
                    if (value === '') {
                        setLifetime(0)
                        return
                    }
                    // Проверяем, что ввод - валидное число и не превышает 3 символа
                    if (value.length <= 3 && !isNaN(value) && !isNaN(parseFloat(value)) && isFinite(value)) {
                        setLifetime(parseFloat(value) * 1000)
                    }
                }} />
                <DefaultButton height='32px' title={'Применить'} flex={1} onClick={handleChangeLifeTime} />
            </div>
        </div>
    )
}