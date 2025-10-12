import pkg from 'number-to-words-ru'
const { convert: convertNumberToWordsRu } = pkg

const map = {
  yo: 'ё', zh: 'ж', ch: 'ч', sh: 'ш', sch: 'щ',
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'е',
  z: 'з', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м',
  n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т',
  u: 'у', f: 'ф', h: 'х', c: 'ц', y: 'ы', '+': 'плюс'
}

export const transliterateMessage = (text) => {
  if (!text) text = ''
  let result = text.toLowerCase()

  // Сначала числа → слова
  result = result.replace(/\d+/g, (match) =>
    convertNumberToWordsRu(match, {
      currency: 'number',
      showNumberParts: { integer: true, fractional: false }
    })
  )

  // Потом транслитерация
  for (const [latin, cyril] of Object.entries(map)) {
    result = result.replaceAll(latin, cyril)
  }

  return result
}