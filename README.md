<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo Idle Clicker</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        #game {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 800px;
            display: flex;
            flex-direction: column;
        }
        #resources {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .resource {
            font-size: 24px;
            font-weight: bold;
        }
        #clickable {
            width: 100px;
            height: 100px;
            background-color: #4CAF50;
            border-radius: 50%;
            margin: 20px auto;
            cursor: pointer;
            transition: transform 0.1s;
        }
        #clickable:active {
            transform: scale(0.95);
        }
        #panels {
            display: flex;
            justify-content: space-between;
        }
        .panel {
            width: 48%;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
        }
        .upgrade, .knowledge-item {
            margin: 10px 0;
        }
        button {
            margin: 5px;
            padding: 10px;
            cursor: pointer;
            width: 200px;
        }
        #perSecond {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .upgrade-count {
            font-size: 14px;
            color: #666;
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
    </style>
</head>
<body>
    <div id="game">
        <div id="resources">
            <div class="resource">Trabalhar: <span id="granaCounter">0</span></div>
            <div class="resource">Conhecimento: <span id="knowledgeCounter">0</span></div>
        </div>
        <div id="perSecond">0 grana por segundo</div>
        <div id="clickable"></div>
        <div id="panels">
            <div id="granaPanel" class="panel">
                <h2>Trabalhar</h2>
                <div class="upgrade">
                    <button id="btn1">Webdesign (Custo: 10)</button>
                    <div id="count1" class="upgrade-count">Quantidade: 0</div>
                </div>
                <div class="upgrade">
                    <button id="btn2">Dropshipping (Custo: 50)</button>
                    <div id="count2" class="upgrade-count">Quantidade: 0</div>
                </div>
                <div class="upgrade">
                    <button id="btn3">Venda de Info Produtos (Custo: 200)</button>
                    <div id="count3" class="upgrade-count">Quantidade: 0</div>
                </div>
            </div>
            <div id="knowledgePanel" class="panel">
                <h2>Conhecimento</h2>
                <div class="knowledge-item">
                    <button id="knowledge1">Gerar conhecimento (Custo: 1000)</button>
                    <div class="progress-bar"><div class="progress" id="progress1"></div></div>
                    <div class="timer" id="timer1"></div>
                    <div class="upgrade-count" id="knowledgeCount1">Nível: 0</div>
                </div>
                <div class="knowledge-item">
                    <button id="knowledge2">Gerar conhecimento (Custo: 5000)</button>
                    <div class="progress-bar"><div class="progress" id="progress2"></div></div>
                    <div class="timer" id="timer2"></div>
                    <div class="upgrade-count" id="knowledgeCount2">Nível: 0</div>
                </div>
                <div class="knowledge-item">
                    <button id="knowledge3">Gerar conhecimento (Custo: 50000)</button>
                    <div class="progress-bar"><div class="progress" id="progress3"></div></div>
                    <div class="timer" id="timer3"></div>
                    <div class="upgrade-count" id="knowledgeCount3">Nível: 0</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let grana = 0;
        let conhecimento = 0;
        let autoClickers = [0, 0, 0];
        let knowledgeLevels = [0, 0, 0];
        const granaCosts = [10, 50, 200];
        const granaIncrements = [1, 5, 20];
        const knowledgeCosts = [1000, 5000, 50000];
        const knowledgeBaseIncrements = [1, 100, 200];
        const knowledgeTimes = [10, 60, 300]; // em segundos
        let knowledgeTimers = [null, null, null];
        let knowledgeCountdowns = [0, 0, 0];

        function updateGrana() {
            document.getElementById('granaCounter').textContent = Math.floor(grana);
        }

        function updateKnowledge() {
            document.getElementById('knowledgeCounter').textContent = Math.floor(conhecimento);
        }

        function updatePerSecond() {
            let totalPerSecond = autoClickers.reduce((total, current, index) => total + current * granaIncrements[index], 0);
            document.getElementById('perSecond').textContent = totalPerSecond + ' grana por segundo';
        }

        function updateUpgradeCounts() {
            for (let i = 0; i < 3; i++) {
                document.getElementById(`count${i+1}`).textContent = `Quantidade: ${autoClickers[i]}`;
                document.getElementById(`knowledgeCount${i+1}`).textContent = `Nível: ${knowledgeLevels[i]}`;
            }
        }

        document.getElementById('clickable').addEventListener('click', () => {
            grana++;
            updateGrana();
        });

        function buyAutoClicker(index) {
            if (grana >= granaCosts[index]) {
                grana -= granaCosts[index];
                autoClickers[index]++;
                updateGrana();
                updateButtons();
                updatePerSecond();
                updateUpgradeCounts();
            }
        }

        function generateKnowledge(index) {
            if (grana >= knowledgeCosts[index]) {
                grana -= knowledgeCosts[index];
                knowledgeLevels[index]++;
                updateGrana();
                updateButtons();
                updateUpgradeCounts();

                if (!knowledgeTimers[index]) {
                    startKnowledgeGeneration(index);
                }
            }
        }

        function startKnowledgeGeneration(index) {
            knowledgeCountdowns[index] = knowledgeTimes[index];
            const progressBar = document.getElementById(`progress${index+1}`);
            const timerElement = document.getElementById(`timer${index+1}`);
            
            function updateProgress() {
                const progress = 1 - (knowledgeCountdowns[index] / knowledgeTimes[index]);
                progressBar.style.width = `${progress * 100}%`;
                timerElement.textContent = `Tempo restante: ${knowledgeCountdowns[index]}s`;
                
                if (knowledgeCountdowns[index] <= 0) {
                    conhecimento += knowledgeBaseIncrements[index] + knowledgeLevels[index];
                    updateKnowledge();
                    knowledgeCountdowns[index] = knowledgeTimes[index];
                } else {
                    knowledgeCountdowns[index]--;
                }
            }

            updateProgress();
            knowledgeTimers[index] = setInterval(updateProgress, 1000);
        }

        document.getElementById('btn1').addEventListener('click', () => buyAutoClicker(0));
        document.getElementById('btn2').addEventListener('click', () => buyAutoClicker(1));
        document.getElementById('btn3').addEventListener('click', () => buyAutoClicker(2));

        document.getElementById('knowledge1').addEventListener('click', () => generateKnowledge(0));
        document.getElementById('knowledge

