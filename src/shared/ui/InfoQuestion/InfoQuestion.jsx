import { useCallback, useRef, useState } from 'react'
import s from './InfoQuestion.module.scss'
import { createPortal } from 'react-dom'
import { DefaultWidgetShape } from '../../widgets/DefaultWidgetShape/DefaultWidgetShape'

export const InfoQuestion = ({ info, height, width, plusLeft = 0, plusTop = 0 }) => {
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const timerRef = useRef(null)
    const hintRef = useRef()

    const styles = {
        width: width ?? undefined,
        height: height ?? undefined
    }

    const handleMouseEnter = useCallback(() => {
        timerRef.current = setTimeout(() => {
            if (hintRef.current) {
                const rect = hintRef.current.getBoundingClientRect()
                setPosition({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX
                })
            }
            setVisible(true)
        }, 500)
    }, [])

    const handleMouseLeave = useCallback(() => {
        clearTimeout(timerRef.current)
        setVisible(false)
    }, [])

    return (
        <div
            className={s.info}
            ref={hintRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles}
        >
            <div className={s.info_circle}>
                ?
            </div>
            {visible &&
                createPortal(
                    <div
                        className={s.info_text}
                        style={{
                            position: 'absolute',
                            top: `${position.top + plusTop}px`,
                            left: `${position.left + plusLeft}px`,
                            zIndex: 9999
                        }}
                    >
                        <DefaultWidgetShape shadow={5} noTitle noBlock width={'max-content'}>
                            {info}
                        </DefaultWidgetShape>
                    </div>,
                    document.body
                )}
        </div>
    )
}