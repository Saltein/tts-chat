import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchTTSOn, selectTwitchVoice, setSpeechVolume, setTwitchTTSOn } from '../../../features/tts-chat/model/slice'
import { DefaultOption, DefaultSelectList, DefaultSlider, DefaultSwitch } from '../../../shared/ui'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './TTSPage.module.scss'

export const TTSPage = () => {
    const dispatch = useDispatch()
    const isTwitchTTSOn = useSelector(selectTwitchTTSOn)
    const twitchVoice = useSelector(selectTwitchVoice)

    const [optionList, setOptionList] = useState([])

    const handleSwitch = () => {
        if (isTwitchTTSOn) {
            dispatch(setTwitchTTSOn(false))
        } else { dispatch(setTwitchTTSOn(true)) }
    }

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const res = await fetch("/api/speakers") // НА ПРОДАКШЕНЕ ОСТАВИТЬ /api/speakers
                if (!res.ok) {
                    const error = await res.json()
                    console.error("Ошибка TTS:", error)
                    return
                }
                const data = await res.json()
                setOptionList(data.speakers)
            } catch (err) {
                console.error("Ошибка запроса к TTS серверу:", err)
            }
        }

        fetchSpeakers()

        // Если нужно очистить что-то при размонтировании:
        return () => {
            // cleanup, если есть
        };
    }, []);

    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} padding={'0'} title='Озвучка чата' paddingBlock={'16px'} flexDirection={'column'} display={'flex'}>
                <DefaultOption name={'Включить озвучку сообщений?'}>
                    <DefaultSwitch state={isTwitchTTSOn} onSwitch={handleSwitch} />
                </DefaultOption>
                <div className={s.settingsBlock}>
                    <DefaultWidgetShape
                        title='Громкость сообщений'
                        width={'fit-content'}
                        margin={'0'}
                        padding={'0 16px 16px 16px'}
                        noBlock
                        justifyTitle={'center'}
                        backgroundColor={'var(--color-items)'}
                    >
                        <DefaultSlider dispatcher={setSpeechVolume} selector={selectSpeechVolume} />
                    </DefaultWidgetShape>
                    <DefaultWidgetShape
                        title='Голос'
                        width={'fit-content'}
                        margin={'0'}
                        padding={'0 16px 16px 16px'}
                        noBlock
                        justifyTitle={'center'}
                        backgroundColor={'var(--color-items)'}
                    >
                        <DefaultSelectList currentSelection={twitchVoice} options={optionList} />
                    </DefaultWidgetShape>
                </div>
            </DefaultWidgetShape>
        </div>
    )
}