const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configurar rota para o cliente
app.use(express.static('public'));

// Inicializar o servidor WebSocket
wss.on('connection', function connection(ws) {
    console.log('Novo cliente conectado');

    ws.on('message', function incoming(message) {
        console.log('Mensagem recebida:', message);
    });

    ws.send('Conexão estabelecida com o servidor');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}`);
});
