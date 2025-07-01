import { useState } from 'react'
import { ConnectionSwitch } from '../../../../shared/ui'
import { DefaultModalWindow } from '../../../../shared/ui/DefaultModalWindow/DefaultModalWindow'
import s from './ConnectionCard.module.scss'

export const ConnectionCard = ({ IconComponent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className={s.wrapper} onClick={() => { setIsModalOpen(true) }}>
            <IconComponent className={s.icon} />
            <ConnectionSwitch />

            {isModalOpen &&
                <DefaultModalWindow onClose={() => { setIsModalOpen(false) }}>
                    <span>aboba</span>
                </DefaultModalWindow>}
        </div>
    )
}