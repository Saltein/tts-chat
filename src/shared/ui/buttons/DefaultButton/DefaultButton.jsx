import s from './DefaultButton.module.scss'

export const DefaultButton = ({
    title,
    onClick,
    height = '48px',
    width,
    active = true,
    color,
    borderRadius,
    flex
}) => {

    const styles = {
        height: height ?? undefined,
        width: width ?? undefined,
        backgroundColor: active ? color : undefined,
        borderRadius: borderRadius ?? undefined,
        flex,
    }

    return (
        <div
            style={styles}
            className={`${s.wrapper} ${!active ? s.disabled : ''}`}
            onClick={active ? onClick : () => { }}
        >
            {active &&
                <div className={s.shine}>
                    <div className={s.shine1} />
                    <div className={`${s.shine1} ${s.s}`} />
                </div>}
            {title}
        </div>
    )
}