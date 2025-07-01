import s from './DefaultWidgetShape.module.scss'

export const DefaultWidgetShape = ({ children, width, height, padding, paddingLeft, gap, marginLeft, backgroundColor, animated = false }) => {
    const styles = {
        width: width && width,
        height: height && height,
        paddingLeft: paddingLeft && paddingLeft,
        padding: padding && padding,
        gap: gap && gap,
        marginLeft: marginLeft && marginLeft,
        backgroundColor: backgroundColor && backgroundColor,
    }

    return (
        <div className={`${s.wrapper} ${animated ? s.animated : ''}`} style={styles}>
            {children}
        </div>
    )
}