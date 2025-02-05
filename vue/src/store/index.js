import Vue from "vue";

export default {
  state: {
    inventory: [],
    coins: 500,
    selectedLocation: null,
    fishList: [
      { id: "fishList1", name: "Карп", catchChance: 0.1, price: 70 },
      { id: "fishList2", name: "Щука", catchChance: 0.05, price: 160 },
      { id: "fishList3", name: "Лещ", catchChance: 0.3, price: 40 },
      { id: "fishList4", name: "Травяная форель", catchChance: 0.05, price: 170 },
      { id: "fishList5", name: "Тунец", catchChance: 0.1, price: 100 },
      { id: "fishList6", name: "Скумбрия", catchChance: 0.2, price: 80 }
    ],
    locations: [
      { id: 1, name: "Река", fishIds: ["fishList1", "fishList2", "fishList3"], image: "https://media-1.gorbilet.com/f0/bd/79/36/c0/c3/shutterstock_1940798533_V7CjMZ0.jpg" },
      { id: 2, name: "Озеро", fishIds: ["fishList4", "fishList2"], image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyYSqJB7qSdsXWYhd37GnOTCGoovKIHvpd5Q&s" },
      { id: 3, name: "Морское побережье", fishIds: ["fishList5", "fishList6"], image: "https://img.tourister.ru/files/3/3/8/9/1/8/8/7/9/original.jpg" }
    ],
    rods: [
      { id: "rods1", name: "Простая удочка", price: 50, power: 10, type: "rod" },
      { id: "rods2", name: "Удочка для крупной рыбы", price: 150, power: 25, type: "rod" }
    ],
    baits: [
      { id: "baits1", name: "Червь", price: 10, catchChance: 0.2, type: "bait" },
      { id: "baits2", name: "Комары", price: 15, catchChance: 0.3, type: "bait" }
    ],
    balance: 500
  },
  getters: {
    inventory: (state) => state.inventory,
    coins: (state) => state.coins,
    selectedLocation: (state) => state.selectedLocation,
    availableLocations: (state) => state.locations,
    rods: (state) => state.rods,
    baits: (state) => state.baits,
    fishForLocation: (state) => (locationId) => {
      const location = state.locations.find(loc => loc.id === locationId);
      if (location) {
        return location.fishIds.map(fishId => state.fishList.find(f => f.id === fishId));
      }
      return [];
    }
  },
  mutations: {
    buyItem(state, item) {
      if (state.coins >= item.price) {
        const existingItem = state.inventory.find(i => i.id === item.id);
    
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.inventory.push({ ...item, quantity: 1 });
        }
    
        state.coins -= item.price;
      } else {
        alert("Недостаточно монет");
      }
    },

    setLocation(state, location) {
      state.selectedLocation = location;
    },

    catchFish(state, fish) {
      const existingFish = state.inventory.find(f => f.name === fish.name && f.type === "fish");
      if (existingFish) {
        existingFish.quantity += 1;
      } else {
        state.inventory.push({ ...fish, id: Date.now(), quantity: 1, type: "fish" });
      }
    },

    sellFish(state, fish) {
      const index = state.inventory.findIndex(f => f.name === fish.name);
      if (index !== -1) {
        const existingFish = state.inventory[index];
        state.coins += fish.price;
        if (existingFish.quantity > 1) {
          existingFish.quantity -= 1;
        } else {
          Vue.delete(state.inventory, index);
        }
      }
    },

    consumeBait(state, baitId) {
      const bait = state.inventory.find(b => b.id === baitId && b.type === "bait");
  
      if (bait && bait.quantity > 0) {
        bait.quantity -= 1;
  
        if (bait.quantity === 0) {
          const index = state.inventory.indexOf(bait);
          if (index !== -1) {
            state.inventory.splice(index, 1);
          }
        }
      }
    },

    decreaseBalance(state, amount) {
      state.coins -= amount;
    }
  },
  actions: {
    catchFishAsync({ commit, rootGetters }, { rod, bait, location }) {
      if (!rod || !bait) {
        return;
      }

      const selectedFishTypes = rootGetters['fishForLocation'](location.id);  
      const fishType = selectedFishTypes[Math.floor(Math.random() * selectedFishTypes.length)];
  
      const rodPower = rod ? rod.power : 10;  // Сила удочки
      const baitChance = bait ? bait.catchChance : 0.2;  // Шанс поймать рыбу с помощью наживки
  
      const fish = fishType;
      const baseCatchChance = fish.catchChance;  // Основной шанс поимки рыбы
      const rodBonus = rodPower * 0.005;  // Бонус от удочки
      const baitBonus = baitChance * 0.1;  // Бонус от наживки
  
      const finalCatchChance = baseCatchChance + rodBonus + baitBonus;
  
      const random = Math.random();
      if (random < finalCatchChance) {
        commit("catchFish", { ...fish, id: Date.now() });
        alert("Вы поймали " + fish.name);
      } else {
        alert("Рыба не клюнула");
      }
      commit("consumeBait", bait.id);
    },

    sellFish({ commit }, fish) {
      commit("sellFish", fish);
      commit("decreaseBalance", fish.price);
    }
  }
};
