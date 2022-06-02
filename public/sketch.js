let socket
let color = '#000'
let strokeWidth = 4
let cv
let cv_context;
function setup() {
    // Creating canvas
    cv = createCanvas(windowWidth / 1.2, windowHeight / 1.5)
    centerCanvas()
    // cv_context = cv.getContext('2d');


    cv.background(255, 255, 255)

    // Start the socket connection
    socket = io.connect('http://localhost:3000')

    // Callback function
    socket.on('mouse', data => {
        stroke(data.color)
        strokeWeight(data.strokeWidth)
        line(data.x, data.y, data.px, data.py)
    })
    socket.on('clearToClients', () => cv.background(255, 255, 255))

    // Getting our buttons and the holder through the p5.js dom
    const color_picker = select('#pickcolor')
    const color_btn = select('#color-btn')
    const color_holder = select('#color-holder')
    const clear_btn = select('#clear_btn')

    const stroke_width_picker = select('#stroke-width-picker')
    const stroke_btn = select('#stroke-btn')
    //
    // Adding a mousePressed listener to the button
    color_btn.mousePressed(() => {
        color = color_picker.value()
    })

    // Adding a mousePressed listener to the button
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

// function windowResized() {
//     centerCanvas()
//     cv.resizeCanvas(windowWidth / 2, windowHeight / 2, false)
// }


function centerCanvas() {
    const x = (windowWidth - width) / 2
    const y = (windowHeight - height) / 2
    cv.position(x, y)
}


function mouseDragged() {
    // Draw
    stroke(color)
    strokeWeight(strokeWidth)
    line(mouseX, mouseY, pmouseX, pmouseY)

    // Send the mouse coordinates
    sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
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