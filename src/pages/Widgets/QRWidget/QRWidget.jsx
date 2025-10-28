import QRCode from 'react-qrcode-logo'
import s from './QRWidget.module.scss'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const QRWidget = ({ value, logoImage, text, frequency = 300, showTime = 30 }) => {
    const [isInvisible, setIsInvisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const [searchParams] = useSearchParams()

    const frequencyParam = searchParams.get('frequency') || frequency
    const showTimeParam = searchParams.get('showTime') || showTime

    useEffect(() => {
        if (!frequencyParam || !showTimeParam) return

        let timeoutOpen, timeoutHide
        setIsInvisible(false)
        setIsOpen(false)

        const cycle = () => {
            // Сначала показать QR без текста
            setIsInvisible(false)
            setIsOpen(false)

            // Через половину showTime открыть блок с текстом
            timeoutOpen = setTimeout(() => {
                setIsOpen(true)
            }, (showTimeParam * 1000) / 2)

            // Через всё showTime скрыть всё
            timeoutHide = setTimeout(() => {
                setIsOpen(false)
                setIsInvisible(true)
            }, showTimeParam * 1000)
        }

        // Первый запуск сразу
        cycle()

        // Повторяем каждые frequency секунд
        const interval = setInterval(cycle, frequencyParam * 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeoutOpen)
            clearTimeout(timeoutHide)
        }
    }, [frequencyParam, showTimeParam])


    return (
        <div className={s.wrapperOfWrapper}>
            <div className={`${s.wrapper} ${isOpen ? s.open : ''} ${isInvisible ? s.invisible : ''}`}>
                <QRCode
                    value={value}
                    qrStyle='dots'
                    ecLevel='Q'
                    logoImage={logoImage}
                    logoPaddingStyle='circle'
                    removeQrCodeBehindLogo
                    fgColor='white'
                    eyeRadius={8}
                    bgColor='transparent'
                />
                <div className={s.text}>{text}</div>
            </div>
        </div>
    )
}
