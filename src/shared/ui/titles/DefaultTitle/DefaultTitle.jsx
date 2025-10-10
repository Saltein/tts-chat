import s from './DefaultTitle.module.scss'

export const DefaultTitle = ({ title, margin, padding, paddingLeft, paddingRight, paddingTop, paddingBottom, alignContent, titleStyles = {}, fontWeight }) => {
    const styles = {
        margin: margin && margin,
        padding: padding && padding,
        paddingLeft: paddingLeft && paddingLeft,
        paddingRight: paddingRight && paddingRight,
        paddingTop: paddingTop && paddingTop,
        paddingBottom: paddingBottom && paddingBottom,
        fontWeight: fontWeight ?? undefined,
        alignSelf: alignContent && alignContent,
        ...titleStyles
    }

    return (
        <h2 className={s.title} style={styles}>{title}</h2>
    )
}