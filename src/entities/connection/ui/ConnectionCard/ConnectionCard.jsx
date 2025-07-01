import { ConnectionSwitch } from '../../../../shared/ui'
import s from './ConnectionCard.module.scss'

export const ConnectionCard = ({ IconComponent }) => {
    return (
        <div className={s.wrapper}>
            <IconComponent className={s.icon} />
            <ConnectionSwitch />
        </div>
    )
}