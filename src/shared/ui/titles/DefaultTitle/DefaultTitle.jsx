import s from './DefaultTitle.module.scss'

export const DefaultTitle = ({ title, margin, padding, paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
    const styles = {
        margin: margin && margin,
        padding: padding && padding,
        paddingLeft: paddingLeft && paddingLeft,
        paddingRight: paddingRight && paddingRight,
        paddingTop: paddingTop && paddingTop,
        paddingBottom: paddingBottom && paddingBottom,
    }

    return (
        <span className={s.title} style={styles}>{title}</span>
    )
}