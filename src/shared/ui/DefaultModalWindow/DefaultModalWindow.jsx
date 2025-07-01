import { DefaultWidgetShape } from '../../widgets/DefaultWidgetShape/DefaultWidgetShape'
import s from './DefaultModalWindow.module.scss'
import { createPortal } from 'react-dom'

export const DefaultModalWindow = ({ children, onClose }) => {
    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            e.stopPropagation()
            onClose()
        }
    }

    return createPortal(
        <div className={s.background} onClick={handleClick}>
            <DefaultWidgetShape animated gap={'8px'}>
                {children}
            </DefaultWidgetShape>
        </div>,
        document.body
    )
}