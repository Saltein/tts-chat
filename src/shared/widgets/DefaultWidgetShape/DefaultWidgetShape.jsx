import s from './DefaultWidgetShape.module.scss'

export const DefaultWidgetShape = ({ children, width, height, padding, paddingLeft, gap, margin, marginLeft, marginRight, marginTop, marginBottom, backgroundColor, animated = false, shadow }) => {
    const styles = {
        width: width && width,
        height: height && height,
        paddingLeft: paddingLeft && paddingLeft,
        padding: padding && padding,
        gap: gap && gap,
        marginTop: marginTop ?? undefined,
        marginBottom: marginBottom ?? undefined,
        marginLeft: marginLeft ?? undefined,
        marginRight: marginRight ?? undefined,
        ...(margin && !(marginTop || marginRight || marginBottom || marginLeft)
            ? { margin }
            : {}),
        backgroundColor: backgroundColor && backgroundColor,
        boxShadow: shadow && `0 ${shadow}px ${shadow * 1.5}px rgba(0, 0, 0, 0.15)`
    }

    return (
        <div className={`${s.wrapper} ${animated ? s.animated : ''}`} style={styles}>
            {children}
        </div>
    )
}