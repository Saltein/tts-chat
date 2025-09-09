import s from './DefaultWarning.module.scss'

export const DefaultWarning = ({text = 'ошибка'}) => {
    return (
        <span className={s.text}>
            {text}
        </span>
    )
}