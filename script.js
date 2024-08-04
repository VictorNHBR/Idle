document.addEventListener('DOMContentLoaded', function() {
    let conhecimento = 500;
    let grana = 0;
    let codigo = 0;
    let dados = 0;
    let currentResource = 'conhecimento';

    const resources = ['conhecimento', 'grana', 'codigo', 'dados'];
    const generationCost = 10;
    const generationTime = 10; // segundos
    const baseGenerationAmount = 10;

    let generationTimers = {};
    let generationLevels = {};
    let productionRates = {};
    let generationStatus = {};

function hidePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('hidden');
    } else {
        console.log(`Painel com ID ${panelId} não encontrado.`);
    }
}


function showPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.remove('hidden');
    } else {
        console.log(`Painel com ID ${panelId} não encontrado.`);
    }
}

    
    function initializeGame() {
        switchActivePanel('conhecimento');
        
        ['grana', 'codigo', 'dados'].forEach(resource => {
            document.getElementById(`${resource}Btn`).classList.add('hidden');
        });

        resources.forEach(resource => {
            generationTimers[resource] = {};
            generationLevels[resource] = {};
            productionRates[resource] = {};
            generationStatus[resource] = {}; // Inicializa o status de geração
            for (let i = 1; i <= 3; i++) {
                generationTimers[resource][i] = null;
                generationLevels[resource][i] = 1;
                productionRates[resource][i] = baseGenerationAmount * i;
                generationStatus[resource][i] = {
                    active: false,
                    remainingTime: generationTime
                };
            }
        });
    }

    function buyUpgrade(buttonId, cost) {
        const button = document.getElementById(buttonId);
        if (conhecimento >= cost) {
            conhecimento -= cost;
            updateResources();
            button.parentNode.removeChild(button);
            console.log(`Upgrade ${buttonId} comprado!`);
            unlockResource(buttonId.replace('unlock', '').toLowerCase());
            checkUpgrades();
        } else {
            console.log("Conhecimento insuficiente para comprar este upgrade.");
        }
    }
    
    document.getElementById('unlockGrana').addEventListener('click', () => buyUpgrade('unlockGrana', 100));
    document.getElementById('unlockCodigo').addEventListener('click', () => buyUpgrade('unlockCodigo', 200));
    document.getElementById('unlockDados').addEventListener('click', () => buyUpgrade('unlockDados', 300));

    document.getElementById('conhecimentoBtn').addEventListener('click', () => switchActivePanel('conhecimento'));
    document.getElementById('granaBtn').addEventListener('click', () => switchActivePanel('grana'));
    document.getElementById('codigoBtn').addEventListener('click', () => switchActivePanel('codigo'));
    document.getElementById('dadosBtn').addEventListener('click', () => switchActivePanel('dados'));

    // acho que os eventlistener de cima tiraram esse
    document.getElementById('clickable').addEventListener('click', () => {
        switch(currentResource) {
            case 'conhecimento':
                conhecimento++;
                break;
            case 'grana':
                grana++;
                break;
            case 'codigo':
                codigo++;
                break;
            case 'dados':
                dados++;
                break;
        }
        updateResources();
    });

    function getGenerationAmount(resource, level) {
        return productionRates[resource][level];
    }

    function updateResources() {
        document.getElementById('conhecimentoCounter').textContent = Math.floor(conhecimento);
        document.getElementById('granaCounter').textContent = Math.floor(grana);
        document.getElementById('codigoCounter').textContent = Math.floor(codigo);
        document.getElementById('dadosCounter').textContent = Math.floor(dados);
    }

    function updateProductionLabels() {
        resources.forEach(resource => {
            for (let i = 1; i <= 3; i++) {
                const label = document.getElementById(`${resource}ProductionLabel${i}`);
                if (label) {
                    label.textContent = `Produção: ${productionRates[resource][i]}/10s`;
                }
            }
        });
    }

    function showPanel(panelId) {
        document.getElementById(panelId).classList.remove('hidden');
    }

    function showButton(buttonId) {
        document.getElementById(buttonId).classList.remove('hidden');
    }

    function unlockResource(resource) {
        // showPanel(`${resource}Panel`);
        // showPanel(`${resource}GenerationPanel`);
        showButton(`${resource}Btn`);
    }

  function switchActivePanel(resource) {
        resources.forEach(res => {
            if (res === resource) {
                showPanel(`${res}GenerationPanel`);
                resumeGeneration(res);
            } else {
                hidePanel(`${res}GenerationPanel`);
                pauseGeneration(res);
            }
        });
        currentResource = resource;
    }

    function pauseGeneration(resource) {
        for (let i = 1; i <= 3; i++) {
            if (generationTimers[resource][i]) {
                clearInterval(generationTimers[resource][i]);
                generationTimers[resource][i] = null;
                // Salva o tempo restante
                const progressBar = document.getElementById(`${resource}Progress${i}`);
                const progress = parseFloat(progressBar.style.width) / 100;
                generationStatus[resource][i].remainingTime = Math.round((1 - progress) * generationTime);
            }
        }
    }


   function resumeGeneration(resource) {
        for (let i = 1; i <= 3; i++) {
            if (generationStatus[resource][i].active && !generationTimers[resource][i]) {
                restartGenerationTimer(resource, i, generationStatus[resource][i].remainingTime);
            }
        }
    }
    
   function startGeneration(resource, level) {
        if (conhecimento >= generationCost) {
            conhecimento -= generationCost;
            updateResources();

            generationLevels[resource][level]++;
            document.getElementById(`${resource}Level${level}`).textContent = generationLevels[resource][level];

            generationStatus[resource][level].active = true;
            if (resource === currentResource) {
                restartGenerationTimer(resource, level, generationTime);
            } else {
                generationStatus[resource][level].remainingTime = generationTime;
            }
        }
    }

   function restartGenerationTimer(resource, level, startTime) {
        if (generationTimers[resource][level]) {
            clearInterval(generationTimers[resource][level]);
        }

        let countdown = startTime;
        const progressBar = document.getElementById(`${resource}Progress${level}`);
        const timerElement = document.getElementById(`${resource}Timer${level}`);

        function updateProgress() {
            const progress = 1 - (countdown / generationTime);
            progressBar.style.width = `${progress * 100}%`;
            timerElement.textContent = `Tempo restante: ${countdown}s`;
            
            if (countdown <= 0) {
                const generationAmount = getGenerationAmount(resource, level);
                switch(resource) {
                    case 'conhecimento':
                        conhecimento += generationAmount;
                        break;
                    case 'grana':
                        grana += generationAmount;
                        break;
                    case 'codigo':
                        codigo += generationAmount;
                        break;
                    case 'dados':
                        dados += generationAmount;
                        break;
                }
                updateResources();
                countdown = generationTime;
            } else {
                countdown--;
            }
            generationStatus[resource][level].remainingTime = countdown;
        }

        updateProgress();
        generationTimers[resource][level] = setInterval(updateProgress, 1000);
    }

    resources.forEach(resource => {
        document.getElementById(`${resource}Btn`).addEventListener('click', () => switchActivePanel(resource));
    });


document.getElementById('conhecimentoBtn').addEventListener('click', () => {
    currentResource = 'conhecimento';
});

document.getElementById('granaBtn').addEventListener('click', () => {
    currentResource = 'grana';
});

document.getElementById('codigoBtn').addEventListener('click', () => {
    currentResource = 'codigo';
});

document.getElementById('dadosBtn').addEventListener('click', () => {
    currentResource = 'dados';
});

        resources.forEach(resource => {
        for (let i = 1; i <= 3; i++) {
            const buttonId = `generate${resource.charAt(0).toUpperCase() + resource.slice(1)}${i}`;
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => startGeneration(resource, i));
            }
        }
    });

    function checkUpgrades() {
        const upgrades = [
            { id: 'unlockGrana', cost: 100 },
            { id: 'unlockCodigo', cost: 200 },
            { id: 'unlockDados', cost: 300 }
        ];

        upgrades.forEach(upgrade => {
            const button = document.getElementById(upgrade.id);
            if (button && !button.classList.contains('hidden')) {
                button.disabled = conhecimento < upgrade.cost;
            }
        });
    }

    setInterval(() => {
        updateResources();
        checkUpgrades();
    }, 1000);
    
    initializeGame();
    updateResources();
    updateProductionLabels();
    checkUpgrades();
});
