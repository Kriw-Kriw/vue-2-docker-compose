import Vue from "vue";

export default {
  state: {
    inventory: [],
    coins: 500,
    selectedLocation: null,
    fishList: [
      { id: "fishList1", name: "Карп", catchChance: 0.1, price: 70, aggression: 1, jerkiness: 1, image: "https://w7.pngwing.com/pngs/332/606/png-transparent-mirror-carp-tilapia-northern-pike-fish-actinopterygii-cyprinus-carpio-seafood-fauna-tail.png" },
      { id: "fishList2", name: "Щука", catchChance: 0.05, price: 160, aggression: 3, jerkiness: 3, image: "https://w7.pngwing.com/pngs/274/484/png-transparent-northern-pike-salmon-09777-perch-pikes-pike-bony-fish-09777-cod.png" },
      { id: "fishList3", name: "Лещ", catchChance: 0.3, price: 40, aggression: 1, jerkiness: 1, image: "https://w7.pngwing.com/pngs/75/611/png-transparent-common-bream-fishing-angling-bifrost-animals-seafood-fauna-thumbnail.png" },
      { id: "fishList4", name: "Травяная форель", catchChance: 0.05, price: 170, aggression: 2, jerkiness: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzw39z6uH45XuweyQAtRjQfEi4C4gQlMOVAw&s" },
      { id: "fishList5", name: "Тунец", catchChance: 0.1, price: 300, aggression: 4, jerkiness: 5, image: "https://e7.pngegg.com/pngimages/300/967/png-clipart-tuna-illustration-yellowfin-tuna-atlantic-bluefin-tuna-skipjack-tuna-fishing-fish-marine-mammal-food.png"  },
      { id: "fishList6", name: "Скумбрия", catchChance: 0.2, price: 80, aggression: 2, jerkiness: 2, image: "https://e7.pngegg.com/pngimages/18/641/png-clipart-atlantic-mackerel-fish-indian-mackerel-food-fish-food-animals-thumbnail.png"  }
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
      const rodBonus = rodPower * 0.05;  // Бонус от удочки
      const baitBonus = baitChance * 0.1;  // Бонус от наживки
  
      const finalCatchChance = baseCatchChance + rodBonus + baitBonus;
  
      const random = Math.random();
      if (random < finalCatchChance) {
        alert("Рыба клюнула - " + fish.name);
        commit("consumeBait", bait.id);

        return fish
      } else {
        alert("Рыба не клюкнула");
        commit("consumeBait", bait.id);

        return null
      }
    },

    catchFish(state, fish) {
      const existingFish = this.state.inventory.find(f => f.name === fish.name && f.type === "fish");
      if (existingFish) {
        existingFish.quantity += 1;
      } else {
        this.state.inventory.push({ ...fish, id: Date.now(), quantity: 1, type: "fish" });
      }
    },

    sellFish({ commit }, fish) {
      commit("sellFish", fish);
      commit("decreaseBalance", fish.price);
    }
  }
};
