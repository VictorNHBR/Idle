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

    resources.forEach(resource => {
        generationTimers[resource] = {};
        generationLevels[resource] = {};
        productionRates[resource] = {};
        for (let i = 1; i <= 3; i++) {
            generationTimers[resource][i] = null;
            generationLevels[resource][i] = 1;
            productionRates[resource][i] = baseGenerationAmount * i;
        }
    });

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
        showPanel(`${resource}Panel`);
        showPanel(`${resource}GenerationPanel`);
        showButton(`${resource}Btn`);
    }

    function startGeneration(resource, level) {
        if (conhecimento >= generationCost) {
            conhecimento -= generationCost;
            updateResources();

            generationLevels[resource][level]++;
            document.getElementById(`${resource}Level${level}`).textContent = generationLevels[resource][level];

            if (!generationTimers[resource][level]) {
                restartGenerationTimer(resource, level);
            }
        }
    }

    function restartGenerationTimer(resource, level) {
        if (!generationTimers[resource][level]) {
            let countdown = generationTime;
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
            }

            updateProgress();
            generationTimers[resource][level] = setInterval(updateProgress, 1000);
        }
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

    updateResources();
    updateProductionLabels();
    checkUpgrades();
