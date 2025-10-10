export const hexToRgbString = (hex) => {
    // Убираем ведущий '#', если он есть
    hex = hex.replace(/^#/, '');

    // Разбиваем на компоненты
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
}

export const rgbStringToHex = (rgbString) => {
    if (!rgbString) return '#000000';

    const [r, g, b] = rgbString.split(',').map(Number);

    // Преобразуем каждое число в двухзначный шестнадцатеричный формат
    const hex = [r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');

    return `#${hex}`;
}