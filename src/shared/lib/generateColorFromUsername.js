const colors = ['#D66E34', '#B8AAFF', '#1D90FF', '#9961F9', '#59A840', '#E73629', '#DE6489', '#20BBA1', '#F8B301', '#0099BB', '#7BBEFF', '#E542FF', '#A36C59', '#8BA259', '#00A9FF', '#A20BFF']

export const generateColorFromUsername = (username) => {
    let sum = 0
    for (const char of username) {
        sum += char.charCodeAt(0)
    }

    const colorIndex = sum & 15

    return colors[colorIndex]
}


generateColorFromUsername('Saltein')
generateColorFromUsername('Megahorosh')
generateColorFromUsername('Валов Максим')
generateColorFromUsername('猫')
generateColorFromUsername('generateColorFromUsername')
generateColorFromUsername('Кодовые точки Юникода простираются в диапазоне от 0 до 1114111')