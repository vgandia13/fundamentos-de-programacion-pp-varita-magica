// Estado "original" de cada elemento, para poder restaurarlo al salir el cursor
const originalState = new WeakMap()

const saveState = (element) => {
    if (!originalState.has(element)) {
        originalState.set(element, {
            src: element.src,
            color: element.style.color,
            backgroundColor: element.style.backgroundColor
        })
    }
}

// Devuelve un color de la paleta distinto al indicado
const getRandomExcept = (array, except) => getRandom(array.filter(value => value !== except))

// 1. Evitar el comportamiento por defecto al hacer click
document.addEventListener('click', (event) => {
    event.preventDefault()
})

// 2. Cambios al hacer click según el tipo de elemento
document.addEventListener('click', (event) => {
    const element = event.target.closest('img, p, article, section')
    if (!element) return

    saveState(element)
    const state = originalState.get(element)

    // 2.1 Imágenes: cambiar por un gif magic-* aleatorio
    if (element.matches('img')) {
        state.src = new URL(getRandom(magicGifs), document.baseURI).href
        element.src = state.src
    }

    // 2.2 Párrafos: cambiar color de texto y de fondo
    if (element.matches('p')) {
        state.color = getRandom(palette)
        state.backgroundColor = getRandomExcept(palette, state.color)
        element.style.color = state.color
        element.style.backgroundColor = state.backgroundColor
    }

    // 2.3 Bloques article o section: cambiar color de fondo
    if (element.matches('article, section')) {
        state.backgroundColor = getRandom(palette)
        element.style.backgroundColor = state.backgroundColor
    }
})

// 3. Cambios al pasar el cursor y restauración al salir
// mouseenter/mouseleave no burbujean, por eso se escuchan en fase de captura
document.addEventListener('mouseenter', (event) => {
    const element = event.target
    if (!(element instanceof Element)) return

    // 3.1 Imágenes: cambiar por abracadabra.gif
    if (element.matches('img')) {
        saveState(element)
        element.src = 'assets/abracadabra.gif'
    }

    // 3.2 Párrafos: cambiar color de texto y de fondo
    if (element.matches('p')) {
        saveState(element)
        const color = getRandom(palette)
        element.style.color = color
        element.style.backgroundColor = getRandomExcept(palette, color)
    }

    // 3.3 Bloques article o section: color de fondo distinto al de párrafo
    if (element.matches('article, section')) {
        saveState(element)
        element.style.backgroundColor = getRandom(blockPalette)
    }
}, true)

document.addEventListener('mouseleave', (event) => {
    const element = event.target
    if (!(element instanceof Element) || !originalState.has(element)) return

    const state = originalState.get(element)
    if (element.matches('img')) {
        element.src = state.src
    } else {
        element.style.color = state.color
        element.style.backgroundColor = state.backgroundColor
    }
}, true)

// 4. Función getRandom: devuelve un valor aleatorio del array
const getRandom = (array) => array[Math.floor(Math.random() * array.length)]

// 5. Paletas de colores de coolors.co usadas con getRandom
const palette = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
const blockPalette = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff']

// 6. Gifs aleatorios usados con getRandom
const magicGifs = [
    'assets/magic-1.gif',
    'assets/magic-2.gif',
    'assets/magic-3.gif',
    'assets/magic-4.gif',
    'assets/magic-5.gif',
    'assets/magic-6.gif'
]
