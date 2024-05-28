# Quiz Game

## Descrição

Este é um jogo de quiz em tempo real que utiliza WebSockets para comunicação entre o servidor e os clientes. O servidor envia perguntas aos clientes conectados, recebe suas respostas, mantém a pontuação dos jogadores e informa o estado do jogo em tempo real.

## Requisitos

- Node.js e npm instalados
- Git

## Configuração do Ambiente

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e defina a porta (opcional):
    ```
    PORT=3000
    ```

4. Certifique-se de que o arquivo `src/questions.json` contenha perguntas e respostas no seguinte formato:
    ```json
    [
        {
            "question": "Oq é uma batata?",
            "answers": ["alien", "animal", "tuberculo", "joaquim"],
            "correct": 2
        },
        {
            "question": "2 + 2?",
            "answers": ["3", "4", "5", "6"],
            "correct": 1
        }
    ]
    ```

## Como Iniciar

1. Inicie o servidor:
    ```sh
    npm start
    ```

2. Abra um navegador e acesse `http://localhost:3000` para iniciar o cliente.

## Como Jogar

1. Quando o cliente for carregado, você será solicitado a inserir seu nome.
2. Após inserir o nome, você entrará no jogo e aguardará o início.
3. Quando a pergunta for exibida, clique na resposta correta.
4. A pontuação será atualizada em tempo real e o jogo continuará até que todas as perguntas sejam respondidas ou o tempo acabe.
5. Quando o jogo terminar, a pontuação final e os vencedores serão exibidos.

## Estrutura do Projeto

- `src/`
  - `server.js`: Código-fonte do servidor com a lógica do jogo de quiz.
  - `questions.json`: Banco de dados de perguntas e respostas em JSON.
- `public/`
  - `app.js`: Código do cliente para exibir perguntas e enviar respostas.
  - `index.html`: Interface básica do cliente.
  - `styles.css`: Estilo.

