import { useEffect, useState } from 'react'
import { DefaultButton, DefaultInput, DefaultTitle } from '../../../shared/ui'
import s from './ChatSettings.module.scss'
import { useSelector } from 'react-redux'
import { selectSpeechVolume, selectTwitchVoice } from '../../../features/tts-chat/model/slice'
import { selectTwitchConnectionData, selectTwitchConnectionStatus } from '../../../entities/connection/model/slice'

export const ChatSettings = () => {
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)

    const currentTheme = localStorage.getItem('theme')
    const volume = useSelector(selectSpeechVolume) / 100
    const twitchChatChannelName = useSelector(selectTwitchConnectionData)?.chatChannelName
    const twitchConnectionStatus = useSelector(selectTwitchConnectionStatus)
    const twitchVoice = useSelector(selectTwitchVoice)

    const baseUrl = process.env.REACT_APP_BASE_URL_WIDGET || ''

    useEffect(() => {
        setLink(`${baseUrl}/widget/chat?twitchChatChannelName=${twitchChatChannelName}&volume=${volume}&twitchConnectionStatus=${twitchConnectionStatus}&twitchVoice=${twitchVoice}&theme=${currentTheme}`)
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