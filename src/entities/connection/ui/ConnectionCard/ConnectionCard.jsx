import { useEffect, useState } from 'react';
import { ConnectionSwitch, DefaultButton, DefaultInput, DefaultTitle, DefaultWarning } from '../../../../shared/ui'
import { DefaultModalWindow } from '../../../../shared/ui/DefaultModalWindow/DefaultModalWindow'
import s from './ConnectionCard.module.scss'
import { DefaultWidgetShape } from '../../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape';
import { useDispatch, useSelector } from 'react-redux';
import { selectTwitchConnectionData } from '../../model/slice';

export const ConnectionCard = ({ IconComponent, inputs = [], title, dispatcher, onMistake = () => { } }) => {
    const dispatch = useDispatch()
    const data = useSelector(selectTwitchConnectionData)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState(data)
    const [isAllFormsFilled, setIsAllFormsFilled] = useState(false)

    const [warningText, setWarningText] = useState('')

    const isFormValid = (data) => {
        return Object.values(data).every(value => value?.toString().trim() !== '');
    }

    const handleSubmit = () => {
        dispatch(dispatcher(formData))
        console.log('Отправляем данные:', formData)
        setIsModalOpen(false)
    }


    useEffect(() => {
        if (title === 'Twitch') {
            setWarningText(onMistake(formData.channelName, formData.chatChannelName))
        }
        setIsAllFormsFilled(isFormValid(formData))
    }, [formData])

    return (
        <div className={s.wrapper}>
            <IconComponent className={s.icon} onClick={() => setIsModalOpen(true)} />
            <ConnectionSwitch serviceName={title}/>

            {isModalOpen && (
                <DefaultModalWindow onClose={() => setIsModalOpen(false)} backgroundColor={'var(--color-background)'} padding={'0'}>
                    <DefaultTitle title={title} padding={'0'} alignContent={'center'} paddingBottom={'8px'} />
                    <DefaultWidgetShape gap={'8px'} margin={'0'}>
                        {inputs.map((input, index) => (
                            <DefaultInput
                                key={index}
                                type={input.type}
                                placeholder={input.placeholder}
                                info={input.info}
                                value={formData[input.name]}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        [input.name]: e.target.value
                                    })
                                }
                            />
                        ))}

                        {warningText && <DefaultWarning text={warningText} />}

                        <DefaultButton title={'Применить'} onClick={handleSubmit} active={isAllFormsFilled && onMistake(formData.channelName, formData.chatChannelName) == ''} />
                    </DefaultWidgetShape>
                </DefaultModalWindow>
            )}
        </div>
    );
};
