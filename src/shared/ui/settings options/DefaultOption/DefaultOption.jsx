import s from './DefaultOption.module.scss'

export const DefaultOption = ({ name, children, paddingRight }) => {
    const styles = {
        paddingRight: paddingRight ?? undefined
    }

    return (
        <div className={s.wrapper} style={styles}>
            <h4 className={s.name}>{name}</h4>
            <div className={s.children}>
                {children}
            </div>
        </div>
    )
}