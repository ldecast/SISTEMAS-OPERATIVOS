const express = require('express');
const cors = require('cors');
const http = require('http');
const Router = require('./endpoints/home');
const Admin = require('./endpoints/admin');

/* init */
const PORT = 8080;
const app = express();
app.use(express.static(__dirname + '/public/build'));

const server = http.createServer(app);

/* Middlewares */
app.use(express.json());
app.use(cors());

/* Router */
app.use('/home', Router);
app.use('/admin', Admin);

/* Inicialización de socket.io */
const io = require('./controllers/sockets').init(server);
io.on('connection', (socket) => {
    console.log('A user is connected');
    socket.on('message', (message) => {
        console.log(`message from ${socket.id} : ${message}`);
    });
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

app.get('/', (req, res) => {
    res.send('GCP App Engine!');
})

/* Starting */
server.listen(PORT, () => {
    console.log(`Server is running on port '${PORT}'.`);
});
