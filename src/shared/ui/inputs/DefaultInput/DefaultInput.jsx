import s from './DefaultInput.module.scss'
import { InfoQuestion } from '../../InfoQuestion/InfoQuestion'

export const DefaultInput = ({ placeholder = '', info, type = 'text', value, onChange, width, height, align, flex }) => {
    const inputStyles = {
        width,
        height,
        textAlign: align ?? undefined,
        flex,
    }

    return (
        <div className={s.wrapper} >
            <input className={s.input} placeholder={placeholder} type={type} value={value} onChange={onChange} style={inputStyles} />
            {info && <InfoQuestion info={info} />}
        </div>
    )
}
