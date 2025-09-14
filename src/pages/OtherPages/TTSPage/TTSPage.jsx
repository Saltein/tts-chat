import { selectSpeechVolume, setSpeechVolume } from '../../../features/tts-chat/model/slice'
import { DefaultOption, DefaultSlider, DefaultSwitch, DefaultTitle } from '../../../shared/ui'
import { TTSButton } from '../../../shared/ui/buttons/TTSButton/TTSButton'
import { DefaultWidgetShape } from '../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './TTSPage.module.scss'

export const TTSPage = () => {
    return (
        <div className={s.wrapper}>
            <DefaultWidgetShape marginLeft={'0'} padding={'0'} title='Озвучка чата' paddingBlock={'16px'} flexDirection={'column'} display={'flex'}>
                <DefaultOption name={'Включить озвучку сообщений?'}>
                    <DefaultSwitch />
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

                    </DefaultWidgetShape>
                </div>
            </DefaultWidgetShape>
        </div>
    )
}