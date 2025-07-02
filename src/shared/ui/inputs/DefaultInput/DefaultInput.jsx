import React, { useState, useRef, useCallback } from 'react'
import s from './DefaultInput.module.scss'
import { DefaultWidgetShape } from '../../../widgets/DefaultWidgetShape/DefaultWidgetShape'
import { createPortal } from 'react-dom'

export const DefaultInput = ({ placeholder = '', info, type = 'text', value, onChange }) => {
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const timerRef = useRef(null)
    const hintRef = useRef()

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
        <div className={s.wrapper}>
            <input className={s.input} placeholder={placeholder} type={type} value={value} onChange={onChange}/>

            <div
                ref={hintRef}
                className={s.info}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                                top: `${position.top}px`,
                                left: `${position.left}px`,
                                zIndex: 9999
                            }}
                        >
                            <DefaultWidgetShape shadow={5}>{info}</DefaultWidgetShape>
                        </div>,
                        document.body
                    )}
            </div>
        </div>
    )
}
