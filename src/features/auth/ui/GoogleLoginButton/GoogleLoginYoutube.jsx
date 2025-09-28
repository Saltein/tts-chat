// GoogleLoginYouTube.jsx
import { useSelector } from 'react-redux'
import { DefaultButton } from '../../../../shared/ui'
import s from './GoogleLoginYoutube.module.scss'
import { useEffect, useState } from "react"
import { selectYoutubeAccessToken } from '../../../../entities/connection/model/slice'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const REDIRECT_URI = window.location.origin + "/oauth2callback"
const SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
].join(" ")

export const GoogleLoginYouTube = ({ onAccessToken }) => {
    const youtubeAccessToken = useSelector(selectYoutubeAccessToken)

    const [loading, setLoading] = useState(false)
    const [isAlreadySignIn, setIsAlreadySignIn] = useState(youtubeAccessToken ? true : false)

    const handleLogin = () => {
        setLoading(true)

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&response_type=token` +
            `&scope=${encodeURIComponent(SCOPES)}` +
            `&include_granted_scopes=true` +
            `&prompt=consent`

        const width = 500, height = 600
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2
        window.open(authUrl, "googleLogin", `width=${width},height=${height},top=${top},left=${left}`)

        const handleMessage = (event) => {
            console.log('event', event)

            if (event.origin !== window.location.origin) return;

            if (event.data?.type === "google_oauth_token") {
                const token = event.data.access_token;
                if (onAccessToken && typeof onAccessToken === "function") {
                    onAccessToken(token);
                }
                setLoading(false);
                window.removeEventListener("message", handleMessage)
            }
        }

        window.addEventListener("message", handleMessage)
    }

    useEffect(() => {
        setIsAlreadySignIn(youtubeAccessToken ? true : false)
    }, [youtubeAccessToken])

    return (
        <div className={s.wrapper}>
            <DefaultButton title={isAlreadySignIn ? "Вы уже вошли через Google" : "Войти через Google"}
                color={'rgba(225, 0, 45, 0.9)'}
                onClick={handleLogin}
                active={!isAlreadySignIn}
                flex={'2'}
            />
            {isAlreadySignIn && <DefaultButton title={'Перезайти'} flex={'1'} onClick={handleLogin} />}
        </div>
    )
}
