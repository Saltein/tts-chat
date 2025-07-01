import { createContext, useContext, useEffect, useState } from 'react';

export function setThemeDOM(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

export function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        setThemeDOM(saved);
    }
}

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'light');

    // Устанавливаем тему в DOM при первом рендере
    useEffect(() => {
        setThemeDOM(theme);
    }, [theme]);

    // Метод, который меняет тему и в DOM, и в state
    const changeTheme = (newTheme) => {
        setThemeState(newTheme);
        setThemeDOM(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
