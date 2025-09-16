import { useEffect, useState } from 'react';
import { ConnectionSwitch, DefaultButton, DefaultInput, DefaultTitle, DefaultWarning } from '../../../../shared/ui'
import { DefaultModalWindow } from '../../../../shared/ui/DefaultModalWindow/DefaultModalWindow'
import s from './ConnectionCard.module.scss'
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
        return Object.values(data).slice(0, -1).every(value => value?.toString().trim() !== '');
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
            <ConnectionSwitch serviceName={title} />

            {isModalOpen && (
                <DefaultModalWindow title={title} onClose={() => setIsModalOpen(false)} backgroundColor={'var(--color-background)'} padding={'0'}>
                    <div className={s.inputs}>
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
                    </div>
                </DefaultModalWindow>
            )}
        </div>
    );
};
