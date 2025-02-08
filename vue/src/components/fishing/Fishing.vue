<template>
  <div class="fishing" :style="{ backgroundImage: 'url(' + selectedLocation.image + ')' }">
    <div class="fishing__content">
      <h1 class="fishing__title">Ловля рыбы на {{ selectedLocation.name }}</h1>
      <p class="fishing__subtitle">Выберите удочку и наживку:</p>

      <div class="fishing__select-group">
        <label for="rod" class="fishing__label">Удочка:</label>
        <select v-model="selectedRod" id="rod" class="fishing__select">
          <option v-for="rod in rodsInInventory" :key="rod.id" :value="rod" class="fishing__option">
            {{ rod.name }} - {{ rod.power }} силы
          </option>
        </select>
      </div>

      <div class="fishing__select-group">
        <label for="bait" class="fishing__label">Наживка:</label>
        <select v-model="selectedBait" id="bait" class="fishing__select">
          <option v-for="bait in baitsInInventory" :key="bait.id" :value="bait" class="fishing__option">
            {{ bait.name }} - {{ bait.quantity }} шт.
          </option>
        </select>
      </div>

      <button 
        v-if="!isFishing" 
        @click="() => startFishing()" 
        :disabled="!selectedRod || !selectedBait || selectedBait.quantity <= 0" 
        class="fishing__button"
      >
        Начать
      </button>

      <div v-if="isFishing" class="fishing__game">
        <div class="fishing__water">
          <img 
            class="fishing__fish" 
            :src="fish.image" 
            :style="{ top: `${fishPosition}%`, transform: `rotate(${fishAngle}deg)` }" 
            alt="Рыба"
          />
          <div class="fishing__line" :style="{ top: '0%', height: `${fishPosition}%` }"></div>
        </div>
        <div class="fishing__tension">Натяжение: {{ tension }}%</div>
        <div class="fishing__tension-bar">
          <div class="fishing__tension-level" :style="{ width: `${tension}%` }"></div>
        </div>
        <button 
          class="fishing__tension-button" 
          @mousedown="() => startIncreasingTension()" 
          @mouseup="() => stopIncreasingTension()" 
          @mouseleave="() => stopIncreasingTension()"
        >
          Тянуть леску
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FishingPage",
  data() {
    return {
      selectedRod: null,
      selectedBait: null,
      isFishing: false,
      fishPosition: 70,
      fishAngle: 0,
      tension: 50,
      tensionChangeRate: 0,
      gameLoop: null,
      fish: null
    };
  },
  computed: {
    ...mapGetters(["selectedLocation", "inventory"]),
    rodsInInventory() {
      return this.inventory.filter((item) => item.type === "rod");
    },
    baitsInInventory() {
      return this.inventory.filter((item) => item.type === "bait");
    },
  },
  methods: {
    ...mapActions(["catchFishAsync", "catchFish"]),

    async startFishing() {
      const success = await this.catchFishAsync({ 
        rod: this.selectedRod, 
        bait: this.selectedBait, 
        location: this.selectedLocation 
      });

      if (success == null) {
        return;
      }

      this.isFishing = true;
      this.fishPosition = 50;
      this.tension = 50;
      this.tensionChangeRate = -1;
      this.fish = success;
      this.gameLoop = setInterval(this.fishFight, 100);
    },

    fishFight() {
      if (!this.fish) return;

      // сопротивление рыбы: случайное число от -aggression до +aggression
      let fishResistance = Math.floor(Math.random() * (this.fish.aggression * 2) - this.fish.aggression);

      // рывок рыбы: происходит с вероятностью 20% + (jerkiness * 5%)
      let fishJerk = Math.random() < 0.2 + this.fish.jerkiness * 0.05 
        ? Math.floor(Math.random() * (this.fish.jerkiness * 3) - this.fish.jerkiness * 1.5) 
        : 0;
      // натяжение лески
      this.tension = Math.max(0, Math.min(100, this.tension + this.tensionChangeRate + fishResistance + fishJerk));

      this.fishPosition = Math.max(0, Math.min(90, this.fishPosition + (this.tension < 50 ? 2 : -2)));

      // угол рыбы, это чисто для ui
      this.fishAngle = this.tension > 50 ? 10 : -10;

      if (this.tension >= 100 || this.fishPosition >= 90) {
        clearInterval(this.gameLoop);
        this.isFishing = false;
        alert("Рыба сорвалась!");
      } else if (this.fishPosition <= 0) {
        clearInterval(this.gameLoop);
        this.isFishing = false;
        this.catchFish({ ...this.fish, id: Date.now() });
        alert("Вы поймали рыбу!");
      }
    },

    startIncreasingTension() {
      this.tensionChangeRate = 3;
    },

    stopIncreasingTension() {
      this.tensionChangeRate = -2;
    },
  },
};
</script>

<style lang="less" scoped>
.fishing {
  font-family: "Arial", sans-serif;
  padding: 20px;
  border-radius: 12px;
  color: white;
  position: relative;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__content {
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 12px;
    width: 100%;
    max-width: 800px;
    text-align: center;
  }

  &__title {
    font-size: 24px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  &__subtitle {
    font-size: 18px;
    margin-bottom: 15px;
    color: #ccc;
  }

  &__select-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
    width: 100%;
  }

  &__label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  &__select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #222;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: border 0.3s ease;

    &:hover {
      border-color: #ff4500;
    }
  }

  &__option {
    background: #222;
    color: white;
  }

  &__button {
    margin-top: 15px;
    padding: 12px 20px;
    background: #ff4500;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #ff0000;
    }

    &:disabled {
      background: gray;
      cursor: not-allowed;
    }
  }

  &__game {
    width: 100%;
    max-width: 600px;
    height: 400px;
    background: rgba(0, 0, 0, 0.6);
    margin-top: 20px;
    border-radius: 12px;
    position: relative;
    text-align: center;
    padding: 20px;
    margin: 0 auto;
  }

  &__water {
    position: relative;
    width: 100%;
    height: 300px;
    background: linear-gradient(to bottom, #0077be, #005599);
    border-radius: 12px;
    overflow: hidden;
  }

  &__fish {
    position: absolute;
    left: 50%;
    transition: top 0.1s ease-out, transform 0.1s ease-out;
    width: 50px;
    transform-origin: center;
  }

  &__line {
    position: absolute;
    left: 50%;
    width: 2px;
    background: white;
    transition: height 0.1s ease-out;
  }

  &__tension {
    margin-top: 10px;
    font-size: 16px;
  }

  &__tension-bar {
    width: 100%;
    height: 12px;
    background: #444;
    margin-top: 10px;
    border-radius: 6px;
    overflow: hidden;
  }

  &__tension-level {
    height: 100%;
    background: yellow;
    transition: width 0.2s ease-in-out;
  }

  &__tension-button {
    margin-top: 15px;
    padding: 10px 16px;
    background: #ff4500;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    transition: background 0.3s ease;

    &:hover {
      background: #ff0000;
    }

    &:active {
      background: #cc0000;
    }
  }
}

</style>
