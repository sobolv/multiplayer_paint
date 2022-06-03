const http = require('http')
const app = require('./app')

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFile = './users.db';
var dbExists = fs.existsSync(dbFile);

if (!dbExists) {
    fs.openSync(dbFile, 'w');
}

var db = new sqlite3.Database(dbFile);

if (!dbExists) {
    console.log("ggggggg")
}
const normalizePort = val => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
    }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})


// Web sockets
const io = require('socket.io')(server)

io.sockets.on('connection', async (socket) => {
    console.log('Client connected: ' + socket.id)
    db.run(`INSERT INTO users
                 VALUES ("${socket.id}", "${new Date()}", "")`);

    socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))

    socket.on('disconnect', () => {
        console.log('Client has disconnected')
        let socket_id = socket.id
        db.run(`UPDATE users SET end_datetime = "${new Date()}" WHERE socket_id = "${socket_id}"`)
    })

    socket.on('clearToServer', () => socket.broadcast.emit('clearToClients'))
})

server.listen(port)