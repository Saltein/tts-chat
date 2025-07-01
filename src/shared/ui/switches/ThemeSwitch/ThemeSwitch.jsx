import s from './ThemeSwitch.module.scss'
import { useEffect, useState } from 'react'
import { DefaultSwitch } from '../DefaultSwitch/DefaultSwitch'
import { useTheme } from '../../../context/theme/ThemeContext'


export const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()

    const [isOn, setOn] = useState(theme === 'dark') // ← сначала объявляем isOn

    useEffect(() => {
        setTheme(isOn ? 'dark' : 'light')             // ← потом используем
    }, [isOn, setTheme])

    return (
        <div className={s.wrapper}>
            <DefaultSwitch state={isOn} onSwitch={setOn} />
        </div>
    )
}