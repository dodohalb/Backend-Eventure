// test.js
const { io } = require('socket.io-client');

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ5MTUxMjM0NTY3OCwiaWF0IjoxNzQ5ODU2MTcwLCJleHAiOjE3NDk5NDI1NzB9.Z8PuQrhd751vyKvdkQPyHFohI7Bj2Q16_5h27iPIeE4"           // Variante mit Umgebungs-Var
const socket = io('ws://localhost:3000/ws',  // ①  Namespace in der URL
{
  path: '/socket.io',                        // ②  Standard-Pfad
  transports: ['websocket'],
  auth: { token: `Bearer ${JWT}` },
});

socket.on('connect', () => {
  console.log('✔ connected as', socket.id);
  socket.emit('ping', {}, (resp) => {
    console.log('⇠ server replied:', resp);  // erwartet: pong
    
  });
});
socket.on('system', (msg) => {
  console.log('[SYSTEM]', msg.text);
  // socket.close();          // Verbindung stößt sonst sofort zu
});


socket.on('connect_error', (e) =>
  console.error('✖ connect_error', e.message)
);