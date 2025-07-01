import s from './DefaultSwitch.module.scss'

export const DefaultSwitch = ({ state, onSwitch }) => {

    const handleSwitch = () => {
        onSwitch(!state)
    }

    return (
        <div className={`${s.wrapper} ${state ? s.on : ''}`} onClick={handleSwitch}>
            <div className={s.circle} />
        </div>
    )
}