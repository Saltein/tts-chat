import { useState } from 'react'
import s from './DefaultSelectList.module.scss'
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg'
import { useDispatch } from 'react-redux'
import { setTwitchVoice } from '../../../../features/tts-chat/model/slice'

export const DefaultSelectList = ({ options = [], currentSelection }) => {
    const dispatch = useDispatch()

    const [selectedOption, setSelectedOption] = useState(currentSelection)
    const [isSelectionOpen, setIsSelectionOpen] = useState(false)

    const handleOpenSelection = () => {
        if (isSelectionOpen) {
            setIsSelectionOpen(false)
        } else {
            setIsSelectionOpen(true)
        }
    }

    const handleSelect = (option) => {
        setSelectedOption(option)
        setIsSelectionOpen(false)
        dispatch(setTwitchVoice(option))
    }

    return (
        <div className={s.wrapper}>
            <div className={`${s.selectedOption} ${isSelectionOpen ? s.open : ''}`} onClick={handleOpenSelection}>
                <span className={s.option}>
                    {selectedOption}
                </span>
                <ChevronDown className={`${s.icon} ${isSelectionOpen ? s.open : ''}`} color='var(--color-text)' />
            </div>
            {isSelectionOpen &&
                <div className={s.selectionList}>
                    {options.map((option, index) => {
                        return (
                            <div className={`${s.option} ${selectedOption === option ? s.current : ''}`} key={index + option} onClick={() => handleSelect(option)}>
                                <span>
                                    {option}
                                </span>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}