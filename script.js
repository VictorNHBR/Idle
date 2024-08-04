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
    // Mostrar apenas o painel de conhecimento inicialmente
    switchActivePanel('conhecimento');
    
    // Esconder os botões de recursos que ainda não foram desbloqueados
    ['grana', 'codigo', 'dados'].forEach(resource => {
        document.getElementById(`${resource}Btn`).classList.add('hidden');
    });
}
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
});
