import s from './SimpleWidgetShape.module.scss'

export const SimpleWidgetShape = ({ children, gap, width }) => {
    const styles = {
        gap,
        width
    }

    return (
        <div className={s.wrapper} style={styles}>
            {children}
        </div>
    )
}