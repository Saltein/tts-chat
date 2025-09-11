import { DefaultTitle } from '../../ui'
import s from './DefaultWidgetShape.module.scss'

export const DefaultWidgetShape = ({
    children,
    width,
    height,
    padding,
    paddingLeft,
    gap, margin,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    backgroundColor,
    animated = false,
    shadow,
    title = 'Заголовок',
    paddingTopBlock,
    paddingBottomBlock,
    paddingLeftBlock,
    paddingRightBlock,
    paddingBlock,
}) => {
    const wrapperStyles = {
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

    const blockStyles = {
        paddingTop: paddingTopBlock ?? undefined,
        paddingBottom: paddingBottomBlock ?? undefined,
        paddingLeft: paddingLeftBlock ?? undefined,
        paddingRight: paddingRightBlock ?? undefined,
        ...(padding && !(paddingTopBlock || paddingBottomBlock || paddingLeftBlock || paddingRightBlock)
            ? { paddingBlock }
            : {}),
    }

    return (
        <div className={`${s.wrapper} ${animated ? s.animated : ''}`} style={wrapperStyles}>
            <DefaultTitle title={title} />
            <div className={s.mainBlock} style={blockStyles}>
                {children}
            </div>
        </div>
    )
}