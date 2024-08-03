   

document.addEventListener('DOMContentLoaded', function() {
    let conhecimento = 500;
    let grana = 0;
    let codigo = 0;
    let dados = 0;
    let currentResource = 'conhecimento';

    const resources = ['conhecimento', 'grana', 'codigo', 'dados'];
    // const generationCost = 10;
    const generationTime = 10; // segundos
    const baseGenerationAmount = 10;

    let generationTimers = {};
    let generationLevels = {};
    let productionRates = {};

 let generators = {
        conhecimento: [
            {
                id: 'conhecimento1',
                name: 'Gerador de Conhecimento Básico',
                costResource: 'conhecimento',
                productionResource: 'conhecimento',
                baseCost: 10,
                baseProduction: 10,
                baseTime: 10,
                costMultiplier: 1.15,
                productionMultiplier: 1.05,
                timeMultiplier: 0.95,
                level: 1
            },
            {
                id: 'conhecimento2',
                name: 'Gerador de Conhecimento Avançado',
                costResource: 'grana',
                productionResource: 'conhecimento',
                baseCost: 100,
                baseProduction: 50,
                baseTime: 30,
                costMultiplier: 1.2,
                productionMultiplier: 1.1,
                timeMultiplier: 0.93,
                level: 0
            }
        ]
    };


	
    // resources.forEach(resource => {
    //     generationTimers[resource] = null;
    //     generationLevels[resource] = 1;
    //     productionRates[resource] = baseGenerationAmount;
    // });

    function getGenerationAmount(resource) {
        return productionRates[resource];
    }

    // function updateResources() {
    //     document.getElementById('conhecimentoCounter').textContent = Math.floor(conhecimento);
    //     document.getElementById('granaCounter').textContent = Math.floor(grana);
    //     document.getElementById('codigoCounter').textContent = Math.floor(codigo);
    //     document.getElementById('dadosCounter').textContent = Math.floor(dados);
    // }

   function updateResources() {
        resources.forEach(resource => {
            document.getElementById(`${resource}Counter`).textContent = Math.floor(window[resource]);
        });
    }

    function createGeneratorElement(generator) {
        const element = document.createElement('div');
        element.className = 'generator';
        element.innerHTML = `
            <h4>${generator.name}</h4>
            <div class="production-label" id="${generator.id}ProductionLabel">Produção: ${generator.baseProduction}/${generator.baseTime}s</div>
            <div class="progress-bar"><div class="progress" id="${generator.id}Progress"></div></div>
            <div class="timer" id="${generator.id}Timer"></div>
            <button id="${generator.id}Generate">Gerar (Custo: ${generator.baseCost} ${generator.costResource})</button>
            <p>Nível: <span id="${generator.id}Level">${generator.level}</span></p>
        `;
        return element;
    }

    // function updateProductionLabels() {
    //     resources.forEach(resource => {
    //         const label = document.getElementById(`${resource}ProductionLabel`);
    //         if (label) {
    //             label.textContent = `Produção: ${productionRates[resource]}/10s`;
    //         }
    //     });
    // }

    function initializeGenerators() {
        const conhecimentoPanel = document.getElementById('conhecimentoGenerators');
        generators.conhecimento.forEach(generator => {
            const generatorElement = createGeneratorElement(generator);
            conhecimentoPanel.appendChild(generatorElement);
            
            document.getElementById(`${generator.id}Generate`).addEventListener('click', () => startGeneration(generator));
        });
    }

	    function getGenerationAmount(generator) {
        return generator.baseProduction * Math.pow(generator.productionMultiplier, generator.level - 1);
    }

    function getGenerationCost(generator) {
        return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, generator.level - 1));
    }

    function getGenerationTime(generator) {
        return generator.baseTime * Math.pow(generator.timeMultiplier, generator.level - 1);
    }

    function startGeneration(generator) {
        const cost = getGenerationCost(generator);
        if (window[generator.costResource] >= cost) {
            window[generator.costResource] -= cost;
            updateResources();

            generator.level++;
            document.getElementById(`${generator.id}Level`).textContent = generator.level;
            document.getElementById(`${generator.id}Generate`).textContent = `Gerar (Custo: ${getGenerationCost(generator)} ${generator.costResource})`;

            restartGenerationTimer(generator);
        }
    }

    function restartGenerationTimer(generator) {
        let countdown = getGenerationTime(generator);
        const progressBar = document.getElementById(`${generator.id}Progress`);
        const timerElement = document.getElementById(`${generator.id}Timer`);

        function updateProgress() {
            const progress = 1 - (countdown / getGenerationTime(generator));
            progressBar.style.width = `${progress * 100}%`;
            timerElement.textContent = `Tempo restante: ${countdown.toFixed(1)}s`;
            
            if (countdown <= 0) {
                const generationAmount = getGenerationAmount(generator);
                window[generator.productionResource] += generationAmount;
                updateResources();
                
                countdown = getGenerationTime(generator);
            } else {
                countdown -= 0.1;
            }
        }

        updateProgress();
        setInterval(updateProgress, 100);
    }

    initializeGenerators();
    updateResources();

   //  function startGeneration(resource) {
   //      if (conhecimento >= generationCost) {
   //          conhecimento -= generationCost;
   //          updateResources();

   //          generationLevels[resource]++;
   //          document.getElementById(`${resource}Level1`).textContent = generationLevels[resource];

   //          restartGenerationTimer(resource);
   //      }
   //  }

   // function restartGenerationTimer(resource) {
   //      if (generationTimers[resource]) {
   //          clearInterval(generationTimers[resource]);
   //      }

//         let countdown = generationTime;
//         const progressBar = document.getElementById(`${resource}Progress1`);
//         const timerElement = document.getElementById(`${resource}Timer1`);

//         function updateProgress() {
//             const progress = 1 - (countdown / generationTime);
//             progressBar.style.width = `${progress * 100}%`;
//             timerElement.textContent = `Tempo restante: ${countdown}s`;
            
//             if (countdown <= 0) {
//                 const generationAmount = getGenerationAmount(resource);
//                 switch(resource) {
//                     case 'conhecimento':
//                         conhecimento += generationAmount;
//                         break;
//                     case 'grana':
//                         grana += generationAmount;
//                         break;
//                     case 'codigo':
//                         codigo += generationAmount;
//                         break;
//                     case 'dados':
//                         dados += generationAmount;
//                         break;
//                 }
//                 updateResources();
                
//                 // Reiniciar o contador sem parar o timer
//                 countdown = generationTime;
//             } else {
//                 countdown--;
//             }
//         }

//         updateProgress();
//         generationTimers[resource] = setInterval(updateProgress, 1000);
//     }
	
})();
