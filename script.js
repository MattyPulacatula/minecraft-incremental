/* 
====================
IN-GAME DATA
====================
*/
const buildings = [
  {
    id: 'wooden_drill',
    name: 'Broca de Madeira',
    cost: 1,
    unitProduction: 0.1,
    icon: 'assets/wooden_pickaxe.png',
  },
  {
    id: 'stone_drill',
    name: 'Broca de Pedra',
    cost: 2,
    unitProduction: 0.5,
    icon: 'assets/stone_pickaxe.png',
  },
  {
    id: 'copper_drill',
    name: 'Broca de Cobre',
    cost: 3,
    unitProduction: 3,
    icon: 'assets/copper_pickaxe.png',
  },
  {
    id: 'iron_drill',
    name: 'Broca de Ferro',
    cost: 4,
    unitProduction: 4,
    icon: 'assets/iron_pickaxe.png',
  },
];
/* 
====================
CLASSES
====================
*/
class Game {
  constructor() {
    this.currency = 0;
    this.clickValue = 1;
    this.loadElements();

    this.buildingsList = new BuildingsList();
    this.NavigationTabs = new NavigationTabs({ navContainerId: 'center-nav' });
    this.startGameLoop();
  }

  loadElements() {
    const btnDiamond = document.getElementById('btn-diamond');
    this.currencyEl = document.getElementById('currency');
    this.totalGameDpsEl = document.getElementById('dps');

    btnDiamond.addEventListener('click', this.incrementClick.bind(this));
  }

  incrementClick() {
    const amount = this.clickValue;
    this.currencyEl.textContent = `Diamantes: ${this.formatCurrencyUI((this.currency += amount))}`;
  }

  startGameLoop() {
    setInterval(() => {
      const totalGameDps = this.buildingsList.totalBuildingsProduction;

      this.currency += totalGameDps;
      this.totalGameDpsEl.textContent = `Diamantes por segundo: ${this.formatCurrencyUI(totalGameDps)}`;
      this.currencyEl.textContent = `Diamantes: ${this.formatCurrencyUI(this.currency)}`;
    }, 1000);
  }

  formatCurrencyUI(value) {
    const roundedValue = parseFloat(value.toFixed(1));

    Number(roundedValue);
    if (Number.isInteger(roundedValue)) return roundedValue;
    return roundedValue.toFixed(1);
  }
}

class NavigationTabs {
  constructor({ navContainerId }) {
    this.navContainer = document.getElementById(`${navContainerId}`);
    this.navButtons = this.navContainer.querySelectorAll('button');

    this.sections = Array.from(this.navButtons)
      .map(button => {
        const tabName = button.dataset.section;
        const sectionEl = document.querySelector(`.${tabName}-section`);
        return sectionEl;
      })
      .filter(section => section !== null);
    console.log(this.sections);

    this.activateSection();
  }

  activateSection() {
    this.navContainer.addEventListener('click', event => {
      const selectedButton = event.target;
      if (selectedButton.classList.contains('btn-nav')) {
        const tabName = selectedButton.dataset.section;
        const sectionEl = document.querySelector(`.${tabName}-section`);

        if (!sectionEl) return; // If end
        this.sections.forEach(section => {
          section.style.display = 'none';
          Array.from(this.navButtons).forEach(b => b.classList.remove('active'));
        }); //forEach end

        sectionEl.style.display = 'flex';
        selectedButton.classList.add('active');
      } // If end
    });
  }
}

class InputModal {
  constructor({ modalId, inputId, hookId, openModalHookId }, { labelText }) {
    this.id = modalId;
    this.inputId = inputId;
    this.labelText = labelText;

    this.backdrop = document.createElement('div');
    this.modal = document.createElement('article');
    this.openButton = document.getElementById(openModalHookId);

    this.createModal(hookId);
    this.defineOpeningLocation();
  }

  createModal(hookId) {
    const hook = document.getElementById(`${hookId}`);
    this.backdrop.className = 'backdrop';

    this.modal.classList.add('modal');
    this.modal.id = this.id;

    this.modal.innerHTML = `
    <label for='${this.inputId}'>${this.labelText}</label>
    <input id='${this.inputId}' type='text'></input>
    <button>Confirmar</button>`;

    const button = this.modal.querySelector('button');
    button.addEventListener('click', this.executeFunction.bind(this, button));
    this.backdrop.addEventListener('click', this.closeModal.bind(this));

    hook.append(this.backdrop);
    hook.append(this.modal);
  }

  defineOpeningLocation() {
    const input = document.getElementById(this.inputId);
    this.openButton.addEventListener('click', () => {
      input.value = '';
      this.backdrop.style.display = 'block';
      this.modal.style.display = 'flex';
    });
  }

  closeModal() {
    this.backdrop.style.display = 'none';
    this.modal.style.display = 'none';
  }

  // Needs to be repaired in the future
  executeFunction(button) {
    const input = document.getElementById(this.inputId);
    if (input.value.trim() === '') return;
    this.openButton.textContent = `Mundo de ${input.value}`;
    this.closeModal();
  }
}
/* 
====================
FILTERED CLASSES:
ITEMS
====================
*/
class BuildingItem {
  // 'unitProduction' refers to single building production (dps)
  constructor(id, name, cost, unitProduction, icon) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.unitProduction = unitProduction;
    this.quantity = 0;
    this.icon = icon;
  }
}

class UpgradeItem {}

class AchievementItem {}
/* 
====================
FILTERED CLASSES:
LISTS
====================
*/

class BuildingsList {
  constructor() {
    this.availableBuildings = buildings.map(b => new BuildingItem(b.id, b.name, b.cost, b.unitProduction, b.icon));
    this.renderBuildings();
  }

  renderBuildings() {
    const hook = document.getElementById('hook-buildings');
    hook.innerHTML = '';
    for (const building of this.availableBuildings) {
      const listItem = this.createBuildingElement(building);
      hook.append(listItem);
    }
  }

  createBuildingElement(building) {
    const listItem = document.createElement('li');
    listItem.className = 'building-item';

    listItem.innerHTML = `
      <div class='building-content'>
        <img class='building-icon' src='${building.icon}'>
        <div class='building-info'>
          <span class='building-title'>${building.name}</span>
          <div class='building-price'>
            <img src='/assets/diamond.png'>
            <span>${building.cost}</span>
          </div>
        </div>
      </div>
      <span class='building-quantity'>${building.quantity}</span>
      `;

    listItem.addEventListener('click', this.purchaseBuilding.bind(this, building));
    return listItem;
  }

  purchaseBuilding(building) {
    if (myGame.currency < building.cost) return;

    myGame.currency -= building.cost;
    building.quantity++;
    building.cost = (building.cost * 1.15 ** building.quantity).toFixed(2);
    myGame.currencyEl.textContent = `Diamantes: ${myGame.formatCurrencyUI(myGame.currency)}`;

    this.renderBuildings();
  }

  get totalBuildingsProduction() {
    let totalDps = 0;
    for (const building of this.availableBuildings) {
      totalDps += building.unitProduction * building.quantity;
    }
    return totalDps;
  }
}

class UpgradesList {}

class AchievementsList {}

/* 
====================
INITIALIZATION
====================
*/
const worldModal = new InputModal(
  {
    inputId: 'input-worldName',
    modalId: 'modal-worldName',
    hookId: 'container',
    openModalHookId: 'btn-worldName',
  },
  {
    labelText: 'Digite o nome do mundo:',
  },
);

const myGame = new Game();
