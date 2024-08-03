   

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
        generationTimers[resource] = null;
        generationLevels[resource] = 1;
        productionRates[resource] = baseGenerationAmount;
    });

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


	
})();
