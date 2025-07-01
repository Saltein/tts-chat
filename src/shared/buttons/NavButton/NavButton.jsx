import { useDispatch, useSelector } from 'react-redux'
import s from './NavButton.module.scss'
import { selectNavPanelCurrentPageID, setNavPanelCurrentPageID } from '../../../widgets/navs/NavPanel/model/slice'
import { useNavigate } from 'react-router-dom'

export const NavButton = ({ title, index = 0, link = '/' }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const currentPageID = useSelector(selectNavPanelCurrentPageID)

    const handleClick = () => {
        dispatch(setNavPanelCurrentPageID(index))
        navigate(link)
    }

    return (
        <div className={`${s.wrapper} ${currentPageID === index ? s.current : ''}`} onClick={handleClick}>
            <div className={`${s.accent} ${currentPageID === index ? s.current : ''}`} />
            {title}
        </div>
    )
}