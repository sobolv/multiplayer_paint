let socket //змінна сокету
let color = '#000'  //змінна кольору
let strokeWidth = 4  //змінна ширини лінії
let cv

function setup() {
    //Створення полотна
    cv = createCanvas(windowWidth / 1.2, windowHeight / 1.5)
    centerCanvas()
    cv.background(255, 255, 255)

    //Ініціалізація сокету
    socket = io.connect('http://localhost:3000')

    //Отрмання даних з інших сокетів
    socket.on('mouse', data => {
        stroke(data.color)
        strokeWeight(data.strokeWidth)
        line(data.x, data.y, data.px, data.py)
    })
    socket.on('clearToClients', () => cv.background(255, 255, 255))

    //Створення кнопок для роботи
    const color_picker = select('#pickcolor')
    const color_btn = select('#color-btn')
    const color_holder = select('#color-holder')
    const clear_btn = select('#clear_btn')

    const stroke_width_picker = select('#stroke-width-picker')
    const stroke_btn = select('#stroke-btn')

    //Створення слухача для кнопки зміни кольору
    color_btn.mousePressed(() => {
        color = color_picker.value()
    })

    //Створення слухача для кнопки зміни товщини лінії
    stroke_btn.mousePressed(() => {
        if(stroke_width_picker.value() < 1){
            console.log('Enter a valid size')
        }
        const width = parseInt(stroke_width_picker.value())
        if (width > 0) strokeWidth = width
    })
}

function clearFunc(){
    cv.background(255, 255, 255)
    socket.emit('clearToServer')
}


function centerCanvas() {
    const x = (windowWidth - width) / 2
    const y = (windowHeight - height) / 2
    cv.position(x, y)
}

//Реалізація малювання
function mouseDragged() {
    stroke(color)
    strokeWeight(strokeWidth)
    line(mouseX, mouseY, pmouseX, pmouseY)

    //Передача координат миші
    sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Функція передачі координат до сокета
function sendmouse(x, y, pX, pY) {
    const data = {
        x: x,
        y: y,
        px: pX,
        py: pY,
        color: color,
        strokeWidth: strokeWidth,
    }
    socket.emit('mouse', data)
}