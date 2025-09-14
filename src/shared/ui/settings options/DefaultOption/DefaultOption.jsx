import s from './DefaultOption.module.scss'

export const DefaultOption = ({ name, children }) => {
    return (
        <div className={s.wrapper}>
            <h4 className={s.name}>{name}</h4>
            <div className={s.children}>
                {children}
            </div>
        </div>
    )
}