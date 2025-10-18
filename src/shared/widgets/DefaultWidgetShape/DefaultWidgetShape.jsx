import { DefaultTitle } from '../../ui'
import s from './DefaultWidgetShape.module.scss'

export const DefaultWidgetShape = ({
    onClick,
    children,
    width,
    height,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    gap,
    margin,
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
    justifyTitle,
    noTitle = false,
    backgroundColorBlock,
    noBlock = false,
    flexDirection,
    display,
    flex,
    overflowBlock,
}) => {
    const wrapperStyles = {
        width: width && width,
        height: height && height,
        paddingLeft: paddingLeft && paddingLeft,
        paddingTop: paddingTop ?? undefined,
        ...(padding && !(paddingTop || paddingBottom || paddingLeft || paddingRight)
            ? { padding }
            : {}),
        gap: gap && gap,
        marginTop: marginTop ?? undefined,
        marginBottom: marginBottom ?? undefined,
        marginLeft: marginLeft ?? undefined,
        marginRight: marginRight ?? undefined,
        ...(margin && !(marginTop || marginRight || marginBottom || marginLeft)
            ? { margin }
            : {}),
        backgroundColor: backgroundColor && backgroundColor,
        boxShadow: shadow && `0 ${shadow}px ${shadow * 1.5}px rgba(0, 0, 0, 0.15)`,
        flex: flex ?? undefined,
        cursor: onClick ? 'pointer' : 'default'
    }

    if (paddingTop || paddingBottom || paddingLeft || paddingRight) {
        wrapperStyles.padding = undefined;
    } else if (padding) {
        wrapperStyles.padding = padding;
    }

    const blockStyles = {
        backgroundColor: backgroundColorBlock ?? undefined,
        paddingTop: paddingTopBlock ?? undefined,
        paddingBottom: paddingBottomBlock ?? undefined,
        paddingLeft: paddingLeftBlock ?? undefined,
        paddingRight: paddingRightBlock ?? undefined,
        ...(padding && !(paddingTopBlock || paddingBottomBlock || paddingLeftBlock || paddingRightBlock)
            ? { paddingBlock }
            : {}),
        flexDirection: flexDirection ?? undefined,
        display: display ?? undefined,
        overflow: overflowBlock ?? undefined,
    }

    const titleStyles = {
        textAlign: justifyTitle,
    }

    return (
        <div className={`${s.wrapper} ${animated ? s.animated : ''}`} style={wrapperStyles}>
            {!noTitle && <DefaultTitle title={title} titleStyles={titleStyles} onClick={onClick} />}

            {noBlock ?
                <>
                    {children}
                </>
                :
                <div className={s.mainBlock} style={blockStyles}>
                    {children}
                </div>
            }


        </div>
    )
}