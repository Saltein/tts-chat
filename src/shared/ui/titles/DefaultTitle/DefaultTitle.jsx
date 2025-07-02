import s from './DefaultTitle.module.scss'

export const DefaultTitle = ({ title, margin, padding, paddingLeft, paddingRight, paddingTop, paddingBottom, alignContent }) => {
    const styles = {
        margin: margin && margin,
        padding: padding && padding,
        paddingLeft: paddingLeft && paddingLeft,
        paddingRight: paddingRight && paddingRight,
        paddingTop: paddingTop && paddingTop,
        paddingBottom: paddingBottom && paddingBottom,
        alignSelf: alignContent && alignContent,
    }

    return (
        <span className={s.title} style={styles}>{title}</span>
    )
}