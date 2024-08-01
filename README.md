<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo Idle Clicker</title>
    <style>
        body, html {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        #game {
            display: flex;
            height: 100vh;
        }
        .left-column {
            display: flex;
            flex-direction: column;
            width: 30%;
        }
        .center-column {
            display: flex;
            flex-direction: column;
            width: 30%;
        }
        .right-column {
            width: 40%;
        }
        .resource-panel {
            flex: 3;
            background-color: #f0f0f0;
            padding: 10px;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .minigames-panel {
            flex: 1;
            background-color: #d0d0d0;
            padding: 10px;
            overflow-y: auto;
        }
        .click-panel {
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
        }
        .upgrades-panel {
            flex: 2;
            background-color: #e0e0e0;
            padding: 10px;
            overflow-y: auto;
        }
        .generation-panel {
            height: 100%;
            background-color: #f0f0f0;
            padding: 10px;
            overflow-y: auto;
        }
        .panel {
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 10px;
            background-color: white;
        }
        .panel-title {
            font-weight: bold;
            margin-bottom: 5px;
            background-color: #e0e0e0;
            padding: 5px;
        }
        .resource-counter {
            font-size: 18px;
            margin-bottom: 10px;
        }
        #clickable {
            width: 100px;
            height: 100px;
            background-color: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.1s;
            margin-bottom: 20px;
        }
        #clickable:active {
            transform: scale(0.95);
        }
        button {
            margin: 5px;
            padding: 10px;
            cursor: pointer;
            width: 180px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 5px;
        }
        .progress {
            width: 0;
            height: 100%;
            background-color: #4CAF50;
            transition: width 0.5s;
        }
        .timer {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="game">
        <div class="left-column">
            <div class="resource-panel">
                <div class="panel-title">Recursos</div>
                <div id="knowledgePanel" class="panel">
                    <div class="panel-title">Conhecimento</div>
                    <div class="resource-counter">Quantidade: <span id="knowledgeCounter">0</span></div>
                </div>
                <div id="granaPanel" class="panel hidden">
                    <div class="panel-title">Grana</div>
                    <div class="resource-counter">Quantidade: <span id="granaCounter">0</span></div>
                </div>
                <div id="codePanel" class="panel hidden">
                    <div class="panel-title">Código</div>
                    <div class="resource-counter">Quantidade: <span id="codeCounter">0</span></div>
                </div>
                <div id="dataPanel" class="panel hidden">
                    <div class="panel-title">Dados</div>
                    <div class="resource-counter">Quantidade: <span id="dataCounter">0</span></div>
                </div>
            </div>
            <div class="minigames-panel">
                <div class="panel-title">Minigames</div>
                <!-- Conteúdo dos minigames será adicionado aqui -->
            </div>
        </div>
        <div class="center-column">
            <div class="click-panel">
                <div id="clickable"></div>
                <div>
                    <button id="learnBtn">Aprender</button>
                    <button id="workBtn" class="hidden">Trabalhar</button>
                    <button id="codeBtn" class="hidden">Programar</button>
                    <button id="trainBtn" class="hidden">Treinar</button>
                </div>
            </div>
            <div class="upgrades-panel">
                <div class="panel-title">Upgrades</div>
                <!-- Conteúdo dos upgrades será adicionado aqui -->
            </div>
        </div>
        <div class="right-column">
            <div class="generation-panel">
                <div id="learnPanel" class="panel">
                    <div class="panel-title">Aprender</div>
                    <button id="generateKnowledge">Gerar Conhecimento (Custo: 10)</button>
                    <div class="progress-bar"><div class="progress" id="knowledgeProgress"></div></div>
                    <div class="timer" id="knowledgeTimer"></div>
                </div>
                <div id="workPanel" class="panel hidden">
                    <div class="panel-title">Trabalhar</div>
                    <button id="generateGrana">Gerar Grana (Custo: 10)</button>
                    <div class="progress-bar"><div class="progress" id="granaProgress"></div></div>
                    <div class="timer" id="granaTimer"></div>
                </div>
                <div id="codePanelGeneration" class="panel hidden">
                    <div class="panel-title">Programar</div>
                    <button id="generateCode">Gerar Código (Custo: 10)</button>
                    <div class="progress-bar"><div class="progress" id="codeProgress"></div></div>
                    <div class="timer" id="codeTimer"></div>
                </div>
                <div id="trainPanelGeneration" class="panel hidden">
                    <div class="panel-title">Treinar</div>
                    <button id="generateData">Gerar Dados (Custo: 10)</button>
                    <div class="progress-bar"><div class="progress" id="dataProgress"></div></div>
                    <div class="timer" id="dataTimer"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let conhecimento = 0;
        let grana = 0;
        let codigo = 0;
        let dados = 0;
        let currentResource = 'conhecimento';
        const generationCost = 10;
        const generationTime = 10; // segundos
        const generationAmount = 10;
        let generationTimers = {
            conhecimento: null,
            grana: null,
            codigo: null,
            dados: null
        };

        function updateResources() {
            document.getElementById('knowledgeCounter').textContent = Math.floor(conhecimento);
            document.getElementById('granaCounter').textContent = Math.floor(grana);
            document.getElementById('codeCounter').textContent = Math.floor(codigo);
            document.getElementById('dataCounter').textContent = Math.floor(dados);
        }

        function showPanel(panelId) {
            document.querySelectorAll('.generation-panel .panel').forEach(panel => panel.classList.add('hidden'));
            document.getElementById(panelId).classList.remove('hidden');
        }

        function showResourcePanel(resourceId) {
            document.getElementById(resourceId).classList.remove('hidden');
        }

        function showButton(buttonId) {
            document.getElementById(buttonId).classList.remove('hidden');
        }

        document.getElementById('clickable').addEventListener('click', () => {
            switch(currentResource) {
                case 'conhecimento':
                    conhecimento++;
                    break;
                case 'grana':
                    grana++;
                    if (grana === 1) {
                        showResourcePanel('granaPanel');
                        showButton('workBtn');
                    }
                    break;
                case 'codigo':
                    codigo++;
                    if (codigo === 1) {
                        showResourcePanel('codePanel');
                        showButton('codeBtn');
                    }
                    break;
                case 'dados':
                    dados++;
                    if (dados === 1) {
                        showResourcePanel('dataPanel');
                        showButton('trainBtn');
                    }
                    break;
            }
            updateResources();
        });

        document.getElementById('learnBtn').addEventListener('click', () => {
            currentResource = 'conhecimento';
            showPanel('learnPanel');
        });

        document.getElementById('workBtn').addEventListener('click', () => {
            currentResource = 'grana';
            showPanel('workPanel');
        });

        document.getElementById('codeBtn').addEventListener('click', () => {
            currentResource = 'codigo';
            showPanel('codePanelGeneration');
        });

        document.getElementById('trainBtn').addEventListener('click', () => {
            currentResource = 'dados';
            showPanel('trainPanelGeneration');
        });

        function startGeneration(resource) {
            if (window[resource] >= generationCost) {
                window[resource] -= generationCost;
                updateResources();

                let countdown = generationTime;
                const progressBar = document.getElementById(`${resource}Progress`);
                const timerElement = document.getElementById(`${resource}Timer`);
                
                function updateProgress() {
                    const progress = 1 - (countdown / generationTime);
                    progressBar.style.width = `${progress * 100}%`;
                    timerElement.textContent = `Tempo restante: ${countdown}s`;
                    
                    if (countdown <= 0) {
                        window[resource] += generationAmount;
                        updateResources();
                        clearInterval(generationTimers[resource]);
                        generationTimers[resource] = null;
                        timerElement.textContent = '';
                        progressBar.style.width = '0%';
                    } else {
                        countdown--;
                    }
                }

                updateProgress();
                generationTimers[resource] = setInterval(updateProgress, 1000);
            }
        }

        document.getElementById('generateKnowledge').addEventListener('click', () => startGeneration('conhecimento'));
        document.getElementById('generateGrana').addEventListener('click', () => startGeneration('grana'));
        document.getElementById('generateCode').addEventListener('click', () => startGeneration('codigo'));
        document.getElementById('generateData').addEventListener('click', () => startGeneration('dados'));

        updateResources();
        showPanel('learnPanel');
    </script>
</body>
</html>
