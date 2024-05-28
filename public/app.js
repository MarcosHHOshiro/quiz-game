document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(`ws://${window.location.host}`);
    let playerName;

    ws.onopen = () => {
        while (!playerName) {
            playerName = prompt('Informe seu nome:').trim();
        }
        ws.send(JSON.stringify({ type: 'join', player: playerName }));
    };

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        handleServerMessage(data);
    };

    startButton.onclick = () => {
        ws.send(JSON.stringify({ type: 'start' }));
    };

    resetButton.onclick = () => {
        ws.send(JSON.stringify({ type: 'reset' }));
    };

    function handleServerMessage(data) {
        const questionElement = document.getElementById('question');
        const answersElement = document.getElementById('answers');
        const statusElement = document.getElementById('status');

        switch (data.type) {
            case 'welcome':
            case 'join':
            case 'ready':
            case 'info':
                statusElement.innerText = data.message;
                if (data.type === 'ready') {
                    startButton.style.display = 'block'; // Mostra o botão de iniciar quando os jogadores estão prontos
                }
                break;
            case 'start':
                startButton.style.display = 'none'; // Esconde o botão de iniciar quando o jogo começa
                resetButton.style.display = 'none'; // Esconde o botão de reiniciar quando o jogo começa
                break;
            case 'question':
                questionElement.innerText = data.question;
                answersElement.innerHTML = '';
                data.answers.forEach((answer, index) => {
                    const button = document.createElement('button');
                    button.innerText = answer;
                    button.onclick = () => {
                        ws.send(JSON.stringify({ type: 'answer', player: playerName, questionIndex: data.questionIndex, answerIndex: index }));
                    };
                    answersElement.appendChild(button);
                });
                break;
            case 'correct':
                statusElement.innerText = `${data.player} Resposta certa! Score: ${data.score}`;
                break;
            case 'incorrect':
                statusElement.innerText = `${data.player} Resposta errada.`;
                break;
            case 'end':
                statusElement.innerText = data.message;
                questionElement.innerText = '';
                answersElement.innerHTML = '';
                resetButton.style.display = 'block'; // Mostra o botão de reiniciar quando o jogo termina
                break;
            case 'reset':
                statusElement.innerText = 'O jogo foi reiniciado. Clique em Iniciar para começar um novo jogo.';
                questionElement.innerText = '';
                answersElement.innerHTML = '';
                startButton.style.display = 'block'; // Mostra o botão de iniciar quando o jogo é reiniciado
                resetButton.style.display = 'none'; // Esconde o botão de reiniciar
                break;
            case 'error':
                statusElement.innerText = data.message;
                break;
        }
    }
});
