const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve the main apology page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'apology.html'));
});

// Socket.IO for real-time love messages
let loveCount = 0;
const messages = [];

io.on('connection', (socket) => {
    console.log('Someone opened the apology page! 💕');
    
    // Send current love count
    socket.emit('loveCount', loveCount);
    socket.emit('messages', messages);
    
    // Handle sending love
    socket.on('sendLove', () => {
        loveCount++;
        io.emit('loveCount', loveCount);
        console.log(`Love count: ${loveCount}`);
    });
    
    // Handle custom messages
    socket.on('sendMessage', (data) => {
        const message = {
            text: data.text,
            time: new Date().toLocaleTimeString(),
            id: Date.now()
        };
        messages.push(message);
        if (messages.length > 10) messages.shift();
        io.emit('newMessage', message);
        console.log(`New message: ${data.text}`);
    });
    
    socket.on('disconnect', () => {
        console.log('Someone left the page 💔');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌹 Apology server running on http://localhost:${PORT}`);
    console.log(`💕 Ready to win her heart!`);
});
