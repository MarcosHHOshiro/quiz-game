const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
let questions = JSON.parse(fs.readFileSync('./src/questions.json'));
let clients = [];
let scores = {};
let currentQuestionIndex = 0;
let gameDuration = 60000; // 60 seconds
let gameTimer;
let gameStarted = false;

wss.on('connection', (ws) => {
    if (clients.length < 2) {
        clients.push(ws);
        ws.send(JSON.stringify({ type: 'welcome', message: 'Bem-vindo ao Quiz Game!' }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleClientMessage(ws, data);
            } catch (error) {
                console.error('Invalid message format:', error);
            }
        });

        ws.on('close', () => {
            clients = clients.filter(client => client !== ws);
            if (clients.length < 2 && gameStarted) {
                endGame('Um jogador desconectou. Jogo terminado.');
            }
        });

        if (clients.length === 2) {
            broadcast({ type: 'ready', message: 'Seu amigo esta entrando! Quase pronto para começar!!' });
        } else {
            ws.send(JSON.stringify({ type: 'info', message: 'Espere seu amigo.' }));
        }
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'O jogo já está cheio.' }));
        ws.close();
    }
});

function handleClientMessage(ws, data) {
    switch (data.type) {
        case 'join':
            handleJoin(ws, data);
            break;
        case 'start':
            handleStart(ws);
            break;
        case 'reset':
            handleReset();
            break;
        case 'answer':
            handleAnswer(data);
            break;
        default:
            ws.send(JSON.stringify({ type: 'error', message: 'Tipo de mensagem desconhecido.' }));
            break;
    }
}

function handleJoin(ws, data) {
    if (!data.player || typeof data.player !== 'string' || data.player.trim() === '') {
        ws.send(JSON.stringify({ type: 'error', message: 'Nome inválido!' }));
        return;
    }
    const playerName = data.player.trim();
    if (!scores.hasOwnProperty(playerName)) {
        scores[playerName] = 0;
        broadcast({ type: 'join', message: `${playerName} entrou no jogo!` });
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Nome já em uso!' }));
    }
}

function handleStart(ws) {
    if (clients.length < 2) {
        ws.send(JSON.stringify({ type: 'error', message: 'Espere seu amigo.' }));
    } else if (!gameStarted) {
        gameStarted = true;
        startGame();
        broadcast({ type: 'start' });
    }
}

function handleReset() {
    resetGame();
    broadcast({ type: 'reset' });
}

function handleAnswer(data) {
    const question = questions[data.questionIndex];
    if (question && data.answerIndex === question.correct) {
        if (!scores[data.player]) {
            scores[data.player] = 0;
        }
        scores[data.player]++;
        broadcast({ type: 'correct', player: data.player, score: scores[data.player] });
    } else {
        scores[data.player]--;
        broadcast({ type: 'incorrect', player: data.player });
    }
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        sendQuestion();
    } else {
        endGame();
    }
}

function sendQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        broadcast({ type: 'question', question: question.question, answers: question.answers, questionIndex: currentQuestionIndex });
    }
}

function startGame() {
    currentQuestionIndex = 0;
    gameTimer = setTimeout(() => {
        endGame('Acabou o tempo');
    }, gameDuration);
    sendQuestion();
}

function endGame(reason = '') {
    clearTimeout(gameTimer);
    const maxScore = Math.max(...Object.values(scores));
    const winners = Object.keys(scores).filter(player => scores[player] === maxScore);
    const message = `Fim de jogo! ${reason ? reason + ' ' : ''}Ganhador: ${winners.join(', ')}. Pontos: ${JSON.stringify(scores)}`;
    broadcast({ type: 'end', message: message });
    resetGame();
}

function resetGame() {
    currentQuestionIndex = 0;
    scores = {};
    gameStarted = false;
}

function broadcast(data) {
    clients.forEach(client => client.send(JSON.stringify(data)));
    if (data.type === 'end') {
        resetGame();
    }
}

app.use(express.static('public'));

server.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});
