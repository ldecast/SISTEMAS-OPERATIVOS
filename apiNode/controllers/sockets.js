const socketIO = require('socket.io');
let io;

module.exports = {
    init: (server) => {
        io = socketIO(server, {
            transports: ['polling'],
            // pingTimeout: 2000,
            cors: {
                cors: {
                    origin: "*"
                }
            }
        });
        return io;
    },
    get: () => {
        if (!io) {
            throw new Error("Socket is not initialized");
        }
        return io;
    }
};