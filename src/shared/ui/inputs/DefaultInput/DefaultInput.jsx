import s from './DefaultInput.module.scss'
import { InfoQuestion } from '../../InfoQuestion/InfoQuestion'

export const DefaultInput = ({ placeholder = '', info, type = 'text', value, onChange, width }) => {
    const inputStyles = {
        width: width ?? undefined
    }

    return (
        <div className={s.wrapper} >
            <input className={s.input} placeholder={placeholder} type={type} value={value} onChange={onChange} style={inputStyles} />
            <InfoQuestion info={info}/>
        </div>
    )
}
