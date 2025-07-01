import s from './DefaultWidgetShape.module.scss'

export const DefaultWidgetShape = ({ children, width, height, paddingLeft, gap, marginLeft }) => {
    const styles = {
        width: width && width,
        height: height && height,
        paddingLeft: paddingLeft && paddingLeft,
        gap: gap && gap,
        marginLeft: marginLeft && marginLeft,
    }

    return (
        <div className={s.wrapper} style={styles}>
            {children}
        </div>
    )
}