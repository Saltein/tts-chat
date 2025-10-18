import { useEffect, useState } from 'react'
import { DefaultButton, DefaultDivider, DefaultInput, DefaultSlider, DefaultSwitch, DefaultTitle } from '../../../shared/ui'
import s from './ChatSettings.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchVoice } from '../../../features/tts-chat/model/slice'
import { selectTwitchConnectionData, selectTwitchConnectionStatus, selectYoutubeAccessToken, selectYoutubeConnectionStatus, selectYoutubeVideoId } from '../../../entities/connection/model/slice'
import { convertObjToStr } from '../../../shared/lib/convertObjToStr'
import { selectMessageBackground, selectMessageBackgroundOpacity, selectMessageBorder, selectMessageGap, selectMessageLifeTime, selectMessageTextColor, selectServiceIcon, setMessageBackground, setMessageBackgroundOpacity, setMessageBorder, setMessageGap, setMessageLifeTime, setMessageTextColor, setServiceIcon } from '../../../entities/message/model/slice'
import { hexToRgbString, rgbStringToHex } from '../../../shared/lib/hexToRgbString'
import { SimpleWidgetShape } from '../../../shared/widgets/SimpleWidgetShape/SimpleWidgetShape'

export const ChatSettings = () => {
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)

    const [lifetime, setLifetime] = useState(useSelector(selectMessageLifeTime))
    const [messageBorderLocal, setMessageBorderLocal] = useState(useSelector(selectMessageBorder))
    const [serviceIconLocal, setServiceIconLocal] = useState(useSelector(selectServiceIcon))
    const [messageGapLocal, setMessageGapLocal] = useState(useSelector(selectMessageGap))

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
        'serviceIcon': String(serviceIconLocal),
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
        dispatch(setMessageBorder(messageBorderLocal))
    }, [messageBorderLocal])

    useEffect(() => {
        dispatch(setServiceIcon(serviceIconLocal))
    }, [serviceIconLocal])

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

    const handleChangeGap = () => {
        dispatch(setMessageGap(messageGapLocal))
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

            <div className={`${s.borderContainer} ${s.container}`}>
                <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Обводка'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <DefaultSwitch state={messageBorderLocal} onSwitch={setMessageBorderLocal} />
            </div>

            <div className={`${s.serviceIconContainer} ${s.container}`}>
                <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Значок сервиса'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <DefaultSwitch state={serviceIconLocal} onSwitch={setServiceIconLocal} />
            </div>

            <div className={`${s.colorContainer} ${s.container}`}>
                <div className={s.colorPickBlock}>
                    <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                        title={'Цвет фона'} titleStyles={{ fontSize: '0.9rem' }} fontWeight={'400'} alignContent={'center'} />
                    <input className={s.colorPicker} value={rgbStringToHex(currentMessageBackgroundColor)} type='color' onChange={handlePickBackgroundColor} />
                </div>
                <div className={s.colorPickBlock}>
                    <DefaultTitle paddingTop={'0'} paddingBottom={'0'} paddingLeft={'0'} paddingRight={'0'}
                        title={'Цвет текста'} titleStyles={{ fontSize: '0.9rem' }} fontWeight={'400'} alignContent={'center'} />
                    <input className={s.colorPicker} value={rgbStringToHex(currentMessageTextColor)} type='color' onChange={handlePickTextColor} />
                </div>
            </div>

            <SimpleWidgetShape>
                <DefaultTitle paddingTop={'0'} paddingBottom={'8px'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Прозрачность фона'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <DefaultSlider selector={selectMessageBackgroundOpacity} dispatcher={setMessageBackgroundOpacity} width='100%' height='32px' isCoefficient />
            </SimpleWidgetShape>

            <SimpleWidgetShape>
                <DefaultTitle paddingTop={'0'} paddingBottom={'8px'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Исчезнут через (с)'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <div className={s.lifetimeContainer}>
                    <DefaultInput placeholder='Время в секундах' height={'32px'} value={lifetime / 1000} align={'center'} width={'72px'} onChange={(e) => {
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
            </SimpleWidgetShape>

            <SimpleWidgetShape>
                <DefaultTitle paddingTop={'0'} paddingBottom={'8px'} paddingLeft={'0'} paddingRight={'0'}
                    title={'Расстояние между (px)'} titleStyles={{ fontSize: '1rem' }} fontWeight={'400'} />
                <div className={s.lifetimeContainer}>
                    <DefaultInput placeholder='Расстояние в пикселях' height={'32px'} value={messageGapLocal} align={'center'} width={'72px'} onChange={(e) => {
                        const value = e.target.value
                        // Если поле пустое, устанавливаем 0
                        if (value === '') {
                            setMessageGapLocal(0)
                            return
                        }
                        // Проверяем, что ввод - валидное число и не превышает 2 символа
                        if (value.length <= 2 && !isNaN(value) && !isNaN(parseFloat(value)) && isFinite(value)) {
                            setMessageGapLocal(parseFloat(value))
                        }
                    }} />
                    <DefaultButton height='32px' title={'Применить'} flex={1} onClick={handleChangeGap} />
                </div>
            </SimpleWidgetShape>
        </div>
    )
}