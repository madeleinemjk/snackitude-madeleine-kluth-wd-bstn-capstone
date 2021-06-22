const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected');
});

app.use((req, _, next) => {
    req.io = io;
    next();
});

require('dotenv').config();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(cors());



// NB: RELOAD_DB will drop and re-create tables, losing data
const reloadDb = process.env.RELOAD_DB === 'true';
console.log(`Reload DB set to ${reloadDb}`);
db.sequelize.sync({force: reloadDb})
    .then(() => {
        console.log('Db sync completed');
    });

server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
}); 