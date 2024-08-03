   

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


// Objeto para armazenar os dados do jogo
const gameData = {
    resources: {
        conhecimento: 0,
        codigo: 0
    }
};

	
    let generationTimers = {};
    let generationLevels = {};
    let productionRates = {};

    resources.forEach(resource => {
        generationTimers[resource] = null;
        generationLevels[resource] = 1;
        productionRates[resource] = baseGenerationAmount;
    });


// Configuração dos recursos
const resourcegenConfigs = {
    conhecimento1: {
        name: 'Conhecimento',
        costResource: 'conhecimento',
        baseCost: 10,
        baseProduction: 1,
        baseTime: 10,
        costMultiplier: 1.1,
        productionMultiplier: 1.05,
        timeMultiplier: 0.98
    },
 
    
};

function initializeSubpanels() {
    const mainPanel = document.getElementById('conhecimentoGenerationPanel');
    const subpanels = mainPanel.querySelectorAll('.generation-subpanel');

    subpanels.forEach(subpanel => {
        const resourceName = subpanel.dataset.resource;
        const config = resourcegenConfigs[resourceName];

        if (!config) return;

        const productionLabel = subpanel.querySelector('.production-label');
        const generateButton = subpanel.querySelector('.generate-button');
        const levelSpan = subpanel.querySelector('.level');

        productionLabel.textContent = `Produção: ${config.baseProduction}/${config.baseTime}s`;
        generateButton.textContent = `Gerar ${config.name} (Custo: ${config.baseCost} ${config.costResource})`;
        generateButton.onclick = () => generateResource(resourceName);

        updateSubpanelDisplay(subpanel, config);
    });
}

function updateSubpanelDisplay(subpanel, config) {
    const productionLabel = subpanel.querySelector('.production-label');
    const generateButton = subpanel.querySelector('.generate-button');
    const levelSpan = subpanel.querySelector('.level');

    const level = parseInt(levelSpan.textContent);
    const currentProduction = Math.floor(config.baseProduction * Math.pow(config.productionMultiplier, level - 1));
    const currentTime = Math.floor(config.baseTime * Math.pow(config.timeMultiplier, level - 1));
    const currentCost = Math.floor(config.baseCost * Math.pow(config.costMultiplier, level - 1));

    productionLabel.textContent = `Produção: ${currentProduction}/${currentTime}s`;
    generateButton.textContent = `Gerar ${config.name} (Custo: ${currentCost} ${config.costResource})`;
}

function generateResource(resourceName) {
    const config = resourcegenConfigs[resourceName];
    const subpanel = document.querySelector(`.generation-subpanel[data-resource="${resourceName}"]`);
    const levelSpan = subpanel.querySelector('.level');
    const level = parseInt(levelSpan.textContent);

    const currentCost = Math.floor(config.baseCost * Math.pow(config.costMultiplier, level - 1));

    if (gameData.resources[config.costResource] >= currentCost) {
        gameData.resources[config.costResource] -= currentCost;
        
        const production = Math.floor(config.baseProduction * Math.pow(config.productionMultiplier, level - 1));
        gameData.resources[resourceName] += production;

        // Aqui você pode adicionar a lógica para a barra de progresso e o temporizador

        updateSubpanelDisplay(subpanel, config);
        updateResourceDisplay();
    } else {
        console.log(`Recursos insuficientes para gerar ${config.name}`);
    }
}

function updateResourceDisplay() {
    // Atualize a exibição dos recursos na interface do usuário
    for (const resource in gameData.resources) {
        const element = document.getElementById(`${resource}Display`);
        if (element) {
            element.textContent = gameData.resources[resource];
        }
    }
}

// Inicialização
initializeSubpanels();
updateResourceDisplay();
























	




	
  function buyUpgrade(buttonId, cost) {
            const button = document.getElementById(buttonId);
            const conhecimento = parseInt(document.getElementById('conhecimentoCounter').textContent);

            if (conhecimento >= cost) {
                // Subtrair o custo do conhecimento
                document.getElementById('conhecimentoCounter').textContent = conhecimento - cost;
                
                // Esconder o botão
                button.classList.add('hidden');

                // Aqui você pode adicionar a lógica para ativar o recurso desbloqueado
                console.log(`Upgrade ${buttonId} comprado!`);
            } else {
                console.log("Conhecimento insuficiente para comprar este upgrade.");
            }
        }

        // Adicionar event listeners para os botões de upgrade
        document.getElementById('unlockGrana').addEventListener('click', () => buyUpgrade('unlockGrana', 100));
        document.getElementById('unlockCodigo').addEventListener('click', () => buyUpgrade('unlockCodigo', 200));
        document.getElementById('unlockDados').addEventListener('click', () => buyUpgrade('unlockDados', 300));

        // Inicialização do jogo (exemplo)
        document.getElementById('conhecimentoCounter').textContent = '500'; // Começar com 500 de conhecimento

	
    function getGenerationAmount(resource) {
        return productionRates[resource];
    }

    function updateResources() {
        document.getElementById('conhecimentoCounter').textContent = Math.floor(conhecimento);
        document.getElementById('granaCounter').textContent = Math.floor(grana);
        document.getElementById('codigoCounter').textContent = Math.floor(codigo);
        document.getElementById('dadosCounter').textContent = Math.floor(dados);
    }

    function updateProductionLabels() {
        resources.forEach(resource => {
            const label = document.getElementById(`${resource}ProductionLabel`);
            if (label) {
                label.textContent = `Produção: ${productionRates[resource]}/10s`;
            }
        });
    }

    function showPanel(panelId) {
        document.getElementById(panelId).classList.remove('hidden');
    }

    function showResourcePanel(resourceId) {
        document.getElementById(resourceId).classList.remove('hidden');
    }

    function showButton(buttonId) {
        document.getElementById(buttonId).classList.remove('hidden');
    }

    function startGeneration(resource) {
        if (conhecimento >= generationCost) {
            conhecimento -= generationCost;
            updateResources();

            generationLevels[resource]++;
            document.getElementById(`${resource}Level1`).textContent = generationLevels[resource];

            restartGenerationTimer(resource);
        }
    }

   function restartGenerationTimer(resource) {
        if (generationTimers[resource]) {
            clearInterval(generationTimers[resource]);
        }

        let countdown = generationTime;
        const progressBar = document.getElementById(`${resource}Progress1`);
        const timerElement = document.getElementById(`${resource}Timer1`);

        function updateProgress() {
            const progress = 1 - (countdown / generationTime);
            progressBar.style.width = `${progress * 100}%`;
            timerElement.textContent = `Tempo restante: ${countdown}s`;
            
            if (countdown <= 0) {
                const generationAmount = getGenerationAmount(resource);
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
                
                // Reiniciar o contador sem parar o timer
                countdown = generationTime;
            } else {
                countdown--;
            }
        }

        updateProgress();
        generationTimers[resource] = setInterval(updateProgress, 1000);
    }

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

    document.getElementById('learnBtn').addEventListener('click', () => {
        currentResource = 'conhecimento';
    });

    document.getElementById('workBtn').addEventListener('click', () => {
        currentResource = 'grana';
    });

    document.getElementById('codeBtn').addEventListener('click', () => {
        currentResource = 'codigo';
    });

    document.getElementById('trainBtn').addEventListener('click', () => {
        currentResource = 'dados';
    });

    resources.forEach(resource => {
        const buttonId = `generate${resource.charAt(0).toUpperCase() + resource.slice(1)}1`;
        document.getElementById(buttonId).addEventListener('click', () => startGeneration(resource));
    });

    // Funções de upgrade
    function unlockResource(resource) {
        showResourcePanel(`${resource}Panel`);
        showPanel(`${resource}GenerationPanel`);
        showButton(`${resource}Btn`);
        // document.getElementById(`unlock${resource.charAt(0).toUpperCase() + resource.slice(1)}`).disabled = true;
    }

    document.getElementById('unlockGrana').addEventListener('click', () => {
        if (conhecimento >= 50) {
            conhecimento -= 50;
            unlockResource('grana');
            updateResources();
        }
    });

    document.getElementById('unlockCodigo').addEventListener('click', () => {
        if (conhecimento >= 100) {
            conhecimento -= 100;
            unlockResource('codigo');
            updateResources();
        }
    });

    document.getElementById('unlockDados').addEventListener('click', () => {
        if (conhecimento >= 150) {
            conhecimento -= 150;
            unlockResource('dados');
            updateResources();
        }
    });

    function checkUpgrades() {
        document.getElementById('unlockGrana').disabled = conhecimento < 50;
        document.getElementById('unlockCodigo').disabled = conhecimento < 100;
        document.getElementById('unlockDados').disabled = conhecimento < 150;
    }

    // Atualizar recursos e verificar upgrades a cada segundo
    setInterval(() => {
        updateResources();
        checkUpgrades();
    }, 1000);

    updateResources();
    updateProductionLabels();
    checkUpgrades();
})();

	    
