import { useState } from 'react'
import { ConnectionSwitch, DefaultButton, DefaultInput } from '../../../../shared/ui'
import { DefaultModalWindow } from '../../../../shared/ui/DefaultModalWindow/DefaultModalWindow'
import s from './ConnectionCard.module.scss'

export const ConnectionCard = ({ IconComponent, inputs = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className={s.wrapper}>
            <IconComponent className={s.icon} onClick={() => { setIsModalOpen(true) }} />
            <ConnectionSwitch />

            {isModalOpen &&
                <DefaultModalWindow onClose={() => { setIsModalOpen(false) }}>
                    {inputs.map((input, index) => {
                        return <DefaultInput key={index} placeholder={input.placeholder} info={input.info} />
                    })}
                    <DefaultButton title={'Применить'} />
                </DefaultModalWindow>}
        </div>
    )
}