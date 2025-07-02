import { useEffect, useState } from 'react';
import { ConnectionSwitch, DefaultButton, DefaultInput, DefaultTitle } from '../../../../shared/ui'
import { DefaultModalWindow } from '../../../../shared/ui/DefaultModalWindow/DefaultModalWindow'
import s from './ConnectionCard.module.scss'
import { DefaultWidgetShape } from '../../../../shared/widgets/DefaultWidgetShape/DefaultWidgetShape';
import { useDispatch, useSelector } from 'react-redux';
import { selectTwitchConnectionData } from '../../model/slice';

export const ConnectionCard = ({ IconComponent, inputs = [], title, dispatcher }) => {
    const dispatch = useDispatch()
    const data = useSelector(selectTwitchConnectionData)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState(data)
    const [isAllFormsFilled, setIsAllFormsFilled] = useState(false)

    const isFormValid = (data) => {
        return Object.values(data).every(value => value?.toString().trim() !== '');
    }

    const handleSubmit = () => {
        dispatch(dispatcher(formData))
        console.log('Отправляем данные:', formData)
    }

    useEffect(() => {
        setIsAllFormsFilled(isFormValid(formData))
    }, [formData])

    return (
        <div className={s.wrapper}>
            <IconComponent className={s.icon} onClick={() => setIsModalOpen(true)} />
            <ConnectionSwitch />

            {isModalOpen && (
                <DefaultModalWindow onClose={() => setIsModalOpen(false)} backgroundColor={'var(--color-background)'} padding={'0'}>
                    <DefaultTitle title={title} padding={'0'} alignContent={'center'} paddingBottom={'8px'} />
                    <DefaultWidgetShape margin={'0'} gap={'8px'}>
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
                        <DefaultButton title={'Применить'} onClick={handleSubmit} active={isAllFormsFilled} />
                    </DefaultWidgetShape>
                </DefaultModalWindow>
            )}
        </div>
    );
};
