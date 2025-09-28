// OAuth2Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OAuth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // убираем #
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");

    if (access_token) {
      // Отправляем токен обратно в родительское окно
      window.opener.postMessage({
        type: "google_oauth_token",
        access_token
      }, window.location.origin);
    }

    // Закрываем окно
    window.close();
    navigate("/"); // или куда нужно
  }, [navigate]);

  return <div>Авторизация...</div>;
};
