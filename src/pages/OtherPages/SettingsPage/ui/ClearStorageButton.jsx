import { useDispatch } from 'react-redux'
import { DefaultButton } from '../../../../shared/ui'
import s from './ClearStorageButton.module.scss'
import { resetConnection } from '../../../../entities/connection/model/slice'
import { resetSettings } from '../../../../features/tts-chat/model/slice'

export const ClearStorageButton = () => {
    const dispatch = useDispatch()

    const handleClear = () => {
        localStorage.clear()
        dispatch(resetConnection())
        dispatch(resetSettings())
    }

    return (
        <DefaultButton onClick={handleClear} title={'Очистить'} height='32px' width={'128px'}>
        </DefaultButton>
    )
}
