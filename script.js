   

document.addEventListener('DOMContentLoaded', function() {
    let conhecimento = 500;
    let grana = 0;
    let codigo = 0;
    let dados = 0;
    let currentResource = 'conhecimento';


/////////////////
    const resources = ['conhecimento', 'grana', 'codigo', 'dados'];
    const baseGenerationAmount = 10;
    const baseGenerationTime = 10;
	

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



/////////////////////

	
    // const resources = ['conhecimento', 'grana', 'codigo', 'dados'];
    // const generationCost = 10;
    // const generationTime = 10; // segundos
    // const baseGenerationAmount = 10;

    // let generationTimers = {};
    // let generationLevels = {};
    // let productionRates = {};

    // resources.forEach(resource => {
    //     generationTimers[resource] = null;
    //     generationLevels[resource] = 1;
    //     productionRates[resource] = baseGenerationAmount;
    // });


  // function buyUpgrade(buttonId, cost) {
  //           const button = document.getElementById(buttonId);
  //           const conhecimento = parseInt(document.getElementById('conhecimentoCounter').textContent);

  //           if (conhecimento >= cost) {
  //               // Subtrair o custo do conhecimento
  //               document.getElementById('conhecimentoCounter').textContent = conhecimento - cost;
                
  //               // Esconder o botão
  //               button.classList.add('hidden');

  //               // Aqui você pode adicionar a lógica para ativar o recurso desbloqueado
  //               console.log(`Upgrade ${buttonId} comprado!`);
  //           } else {
  //               console.log("Conhecimento insuficiente para comprar este upgrade.");
  //           }
  //       }

  //       // Adicionar event listeners para os botões de upgrade
  //       document.getElementById('unlockGrana').addEventListener('click', () => buyUpgrade('unlockGrana', 100));
  //       document.getElementById('unlockCodigo').addEventListener('click', () => buyUpgrade('unlockCodigo', 200));
  //       document.getElementById('unlockDados').addEventListener('click', () => buyUpgrade('unlockDados', 300));

  //       // Inicialização do jogo (exemplo)
  //       document.getElementById('conhecimentoCounter').textContent = '500'; // Começar com 500 de conhecimento

	
  //   function getGenerationAmount(resource) {
  //       return productionRates[resource];
  //   }

//removi por que o debaixo funcionou
    // function updateResources() {
    //     document.getElementById('conhecimentoCounter').textContent = Math.floor(conhecimento);
    //     document.getElementById('granaCounter').textContent = Math.floor(grana);
    //     document.getElementById('codigoCounter').textContent = Math.floor(codigo);
    //     document.getElementById('dadosCounter').textContent = Math.floor(dados);
    // }

  // function updateResources() {
  //       resources.forEach(resource => {
  //           document.getElementById(`${resource}Counter`).textContent = Math.floor(window[resource]);
  //       });
  //   }
	
  //   function updateProductionLabels() {
  //       resources.forEach(resource => {
  //           const label = document.getElementById(`${resource}ProductionLabel`);
  //           if (label) {
  //               label.textContent = `Produção: ${productionRates[resource]}/10s`;
  //           }
  //       });
  //   }

  //   function showPanel(panelId) {
  //       document.getElementById(panelId).classList.remove('hidden');
  //   }

  //   function showResourcePanel(resourceId) {
  //       document.getElementById(resourceId).classList.remove('hidden');
  //   }

  //   function showButton(buttonId) {
  //       document.getElementById(buttonId).classList.remove('hidden');
  //   }

  //   function startGeneration(resource) {
  //       if (conhecimento >= generationCost) {
  //           conhecimento -= generationCost;
  //           updateResources();

  //           generationLevels[resource]++;
  //           document.getElementById(`${resource}Level1`).textContent = generationLevels[resource];

  //           restartGenerationTimer(resource);
  //       }
  //   }

  //  function restartGenerationTimer(resource) {
  //       if (generationTimers[resource]) {
  //           clearInterval(generationTimers[resource]);
  //       }

  //       let countdown = generationTime;
  //       const progressBar = document.getElementById(`${resource}Progress1`);
  //       const timerElement = document.getElementById(`${resource}Timer1`);

  //       function updateProgress() {
  //           const progress = 1 - (countdown / generationTime);
  //           progressBar.style.width = `${progress * 100}%`;
  //           timerElement.textContent = `Tempo restante: ${countdown}s`;
            
  //           if (countdown <= 0) {
  //               const generationAmount = getGenerationAmount(resource);
  //               switch(resource) {
  //                   case 'conhecimento':
  //                       conhecimento += generationAmount;
  //                       break;
  //                   case 'grana':
  //                       grana += generationAmount;
  //                       break;
  //                   case 'codigo':
  //                       codigo += generationAmount;
  //                       break;
  //                   case 'dados':
  //                       dados += generationAmount;
  //                       break;
  //               }
  //               updateResources();
                
  //               // Reiniciar o contador sem parar o timer
  //               countdown = generationTime;
  //           } else {
  //               countdown--;
  //           }
  //       }

        updateProgress();
        generationTimers[resource] = setInterval(updateProgress, 1000);
    }

    // document.getElementById('clickable').addEventListener('click', () => {
    //     switch(currentResource) {
    //         case 'conhecimento':
    //             conhecimento++;
    //             break;
    //         case 'grana':
    //             grana++;
    //             break;
    //         case 'codigo':
    //             codigo++;
    //             break;
    //         case 'dados':
    //             dados++;
    //             break;
    //     }
    //     updateResources();
    // });

    // document.getElementById('learnBtn').addEventListener('click', () => {
    //     currentResource = 'conhecimento';
    // });

    // document.getElementById('workBtn').addEventListener('click', () => {
    //     currentResource = 'grana';
    // });

    // document.getElementById('codeBtn').addEventListener('click', () => {
    //     currentResource = 'codigo';
    // });

    // document.getElementById('trainBtn').addEventListener('click', () => {
    //     currentResource = 'dados';
    // });

    // resources.forEach(resource => {
    //     const buttonId = `generate${resource.charAt(0).toUpperCase() + resource.slice(1)}1`;
    //     document.getElementById(buttonId).addEventListener('click', () => startGeneration(resource));
    // });

    // // Funções de upgrade
    // function unlockResource(resource) {
    //     showResourcePanel(`${resource}Panel`);
    //     showPanel(`${resource}GenerationPanel`);
    //     showButton(`${resource}Btn`);
    //     // document.getElementById(`unlock${resource.charAt(0).toUpperCase() + resource.slice(1)}`).disabled = true;
    // }

    // document.getElementById('unlockGrana').addEventListener('click', () => {
    //     if (conhecimento >= 50) {
    //         conhecimento -= 50;
    //         unlockResource('grana');
    //         updateResources();
    //     }
    // });

    // document.getElementById('unlockCodigo').addEventListener('click', () => {
    //     if (conhecimento >= 100) {
    //         conhecimento -= 100;
    //         unlockResource('codigo');
    //         updateResources();
    //     }
    // });

    // document.getElementById('unlockDados').addEventListener('click', () => {
    //     if (conhecimento >= 150) {
    //         conhecimento -= 150;
    //         unlockResource('dados');
    //         updateResources();
    //     }
    // });

    // function checkUpgrades() {
    //     document.getElementById('unlockGrana').disabled = conhecimento < 50;
    //     document.getElementById('unlockCodigo').disabled = conhecimento < 100;
    //     document.getElementById('unlockDados').disabled = conhecimento < 150;
    // }

    // // Atualizar recursos e verificar upgrades a cada segundo
    // setInterval(() => {
    //     updateResources();
    //     checkUpgrades();
    // }, 1000);

    updateResources();
    // updateProductionLabels();
    // checkUpgrades();

    initializeGenerators();
    updateResources();

})();

	    
