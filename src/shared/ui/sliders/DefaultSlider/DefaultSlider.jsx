import { useState, useRef, useCallback, useEffect } from 'react'
import s from './DefaultSlider.module.scss'
import { useDispatch, useSelector } from 'react-redux'

export const DefaultSlider = ({
    width = '256px',
    height = '48px',
    selector,
    dispatcher,
    isCoefficient = false,
    postfix = '',
    min = 0,
    max = isCoefficient ? 1 : 100
}) => {
    const currentValue = useSelector(selector)

    const [position, setPosition] = useState(currentValue)
    const wrapperRef = useRef(null)
    const isDragging = useRef(false)

    const dispatch = useDispatch()

    const handleMouseDown = useCallback((e) => {
        isDragging.current = true
        updatePosition(e)
        document.addEventListener('mouseup', handleMouseUp)
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current) return
        updatePosition(e)
    }, [])

    const handleMouseUp = useCallback(() => {
        isDragging.current = false
        document.removeEventListener('mouseup', handleMouseUp)
    }, [])

    const updatePosition = useCallback((e) => {
        if (!wrapperRef.current) return

        const rect = wrapperRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left

        let newPosition
        if (isCoefficient) {
            // Ограничение до min-max и округление до сотых
            newPosition = Math.min(max, Math.max(min, min + (x / rect.width) * (max - min)))
            newPosition = Math.round(newPosition * 100) / 100
        } else {
            newPosition = Math.min(max, Math.max(min, min + (x / rect.width) * (max - min)))
            newPosition = Math.round(newPosition)
        }

        setPosition(newPosition)
        dispatch(dispatcher(newPosition))
    }, [dispatcher, isCoefficient, dispatch, min, max])

    // Синхронизация с внешним значением
    useEffect(() => {
        setPosition(currentValue)
    }, [currentValue])

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        return () => document.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    // Вычисление criticalValue относительно нового диапазона
    const criticalValue = min + (max - min) * (isCoefficient ? 0.2 : 0.2)

    // Стили
    const styles = {
        width,
        height,
        borderLeft: position <= criticalValue ? `${1}px solid rgba(255, 0, 0, ${(criticalValue - position) / criticalValue})` : ''
    }

    // Вычисление позиции слайдера относительно нового диапазона
    const sliderPosition = ((position - min) / (max - min)) * 100
    const sliderStyles = {
        right: `${100 - sliderPosition}%`,
    }

    return (
        <div
            ref={wrapperRef}
            className={s.wrapper}
            style={styles}
            onMouseDown={handleMouseDown}
        >
            <span className={s.value} style={{ fontSize: height }}>{position + postfix}</span>
            <div className={s.slider} style={sliderStyles}>
                <div className={s.slider_circle} style={{ height }} />
            </div>
        </div>
    )
}