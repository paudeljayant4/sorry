const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store shared state
let loveCount = 520; // Starting love count
let messages = [];

io.on('connection', (socket) => {
    console.log('A lover connected!');
    
    // Send current state to new client
    socket.emit('init', { loveCount, messages });
    
    // Handle new love clicks
    socket.on('addLove', () => {
        loveCount++;
        io.emit('loveUpdated', loveCount);
    });
    
    // Handle new messages
    socket.on('sendMessage', (data) => {
        const newMessage = {
            text: data.text,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
        };
        messages.push(newMessage);
        if (messages.length > 10) messages.shift(); // Keep last 10
        io.emit('newMessage', newMessage);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`❤️  Apology server running at http://localhost:${PORT}`);
    console.log('Ready to win her heart!');
});
