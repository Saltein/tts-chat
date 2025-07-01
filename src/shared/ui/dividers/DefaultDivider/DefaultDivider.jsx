import { useEffect, useState } from 'react'
import s from './DefaultDivider.module.scss'

export const DefaultDivider = ({ direction = 'horizontal', color }) => {
    const [directionValid, setDirectionValid] = useState('horizontal')
    const styles = {
        backgroundColor: color && color,
    }

    useEffect(() => {
        if (direction === 'horizontal' || direction === 'vertical') {
            setDirectionValid(direction)
            return
        }
        else {
            setDirectionValid('horizontal')
            console.error('Invalid DefaultDivider direction (use "horizontal" or "vertical" only)')
        }
    }, [direction])

    return (
        <div className={`${s.wrapper} ${directionValid === 'horizontal' ? s.h : ''} ${directionValid === 'vertical' ? s.v : ''}`}
            style={styles}
        />
    )
}