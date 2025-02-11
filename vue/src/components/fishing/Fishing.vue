<template>
  <div class="fishing" :style="{ backgroundImage: 'url(' + selectedLocation.image + ')' }">
    <div class="fishing__content">
      <h1 class="fishing__title">Ловля рыбы на {{ selectedLocation.name }}</h1>
      <p class="fishing__subtitle">Выберите удочку и наживку:</p>

      <div class="fishing__select-group">
        <label for="rod" class="fishing__label">Удочка:</label>
        <select v-model="selectedRod" id="rod" class="fishing__select">
          <option v-for="rod in rodsInInventory" :key="rod.id" :value="rod">
            {{ rod.name }} - {{ rod.power }} силы
          </option>
        </select>
      </div>

      <div class="fishing__select-group">
        <label for="bait" class="fishing__label">Наживка:</label>
        <select v-model="selectedBait" id="bait" class="fishing__select">
          <option v-for="bait in baitsInInventory" :key="bait.id" :value="bait">
            {{ bait.name }} - {{ bait.quantity }} шт.
          </option>
        </select>
      </div>

      <button 
        v-if="!isFishing" 
        @click="startFishing" 
        :disabled="!selectedRod || !selectedBait || selectedBait.quantity <= 0" 
        class="fishing__button"
      >
        Начать
      </button>

      <div v-if="isFishing" class="fishing__game">
        <div class="fishing__water" @click="castLine">
          <div 
            v-if="isCasting || isWaitingForBite" 
            class="fishing__bobber" 
            :style="{ 
              top: `${bobberPosition}%`, 
              left: `${bobberPositionHor}%`, 
              transform: `translate(-${bobberPositionHor}%, -50%)`
            }"
          ></div>
          <img 
            v-if="fish" 
            class="fishing__fish" 
            :src="fish.image" 
            :style="{ 
              top: `${fishPosition}%`, 
              left: `${fishPositionHor}%`, 
              transform: `translate(-${fishPositionHor}%, -50%) rotate(${fishAngle}deg)`
            }" 
            alt="Рыба"
          />
          <div class="fishing__line" 
          v-if="fish"
            :style="{ 
              height: `${fishPosition}%`,
              left:  `${fishPositionHor}%`, 
              transform: `translateX(-${fishPositionHor}%)`
            }">
          </div>
        </div>

        <div v-if="fish" class="fishing__tension">Натяжение: {{ tension }}%</div>
        <div v-if="fish" class="fishing__tension-bar">
          <div class="fishing__tension-level" :style="{ width: `${tension}%` }"></div>
        </div>

        <button 
          v-if="fish" 
          class="fishing__tension-button" 
          @mousedown="startIncreasingTension" 
          @mouseup="stopIncreasingTension" 
          @mouseleave="stopIncreasingTension"
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
      isCasting: false,
      isWaitingForBite: false,
      castPositionHor: 50,
      castPositionVer: 50,
      bobberPosition: null,
      bobberPositionHor: null,
      tension: 50,
      tensionChangeRate: 0,
      gameLoop: null,
      fish: null,
      fishPosition: 50,
      fishPositionHor: 50,
      fishAngle: 0,
      biteChance: 50,
      baitLostChance: 30,
      noFishChance: 20,
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

    startFishing() {
      this.isFishing = true;
      this.isCasting = true;
      this.fish = null;
    },

    castLine(event) {
      if (!this.isCasting) return;

      const boundingRect = event.currentTarget.getBoundingClientRect();
      this.castPositionHor = ((event.clientX - boundingRect.left) / boundingRect.width) * 100;
      this.castPositionVer = ((event.clientY - boundingRect.top) / boundingRect.height) * 100;

      this.bobberPositionHor = this.castPositionHor;
      this.bobberPosition = this.castPositionVer;

      this.isCasting = false;
      this.isWaitingForBite = true;

      const waitTime = Math.floor(Math.random() * 3000) + 2000;
      setTimeout(this.checkBite, waitTime);
    },

    async checkBite() {
      this.isWaitingForBite = false;
      const rand = Math.random() * 100;

      if (rand < this.biteChance) {
        const success = await this.catchFishAsync({ 
          rod: this.selectedRod, 
          bait: this.selectedBait, 
          location: this.selectedLocation 
        });

        if (success) {
          this.fish = success;
          this.spawnFish();
        } else {
          alert("Рыба сорвалась!");
          this.isFishing = false;
        }
      } else if (rand < this.biteChance + this.baitLostChance) {
        alert("Наживку съели!");
        this.selectedBait.quantity -= 1;
        this.isFishing = false;
      } else {
        alert("Рыбы здесь нет.");
        this.isFishing = false;
      }
    },

    spawnFish() {
      this.fishPositionHor = this.bobberPositionHor;
      this.fishPosition = this.bobberPosition;
      this.tension = 50;
      this.tensionChangeRate = -1;
      this.gameLoop = setInterval(this.fishFight, 100);
    },

    fishFight() {
      if (!this.fish) return;

      let fishResistance = Math.floor(Math.random() * (this.fish.aggression * 2) - this.fish.aggression);
      let fishJerk = Math.random() < 0.25 + this.fish.jerkiness * 0.07 
        ? Math.floor(Math.random() * (this.fish.jerkiness * 5) - this.fish.jerkiness * 2.5) 
        : 0;

      this.tension = Math.max(0, Math.min(100, this.tension + this.tensionChangeRate + fishResistance + fishJerk));
      this.fishPosition = Math.max(10, Math.min(90, this.fishPosition + (this.tension < 50 ? 2 : -2)));

      if(this.bobberPosition < 20) {
        this.fishPosition += 10
      } else if (this.bobberPosition > 40) {
        this.fishPosition -= 10
      }

      let maxHorizontalShift = 40 + this.fish.jerkiness * 3;
      let targetHor = Math.max(5, Math.min(95, this.fishPositionHor + Math.floor(Math.random() * maxHorizontalShift) - (maxHorizontalShift / 2)));
      
      this.fishPositionHor += (targetHor - this.fishPositionHor) * (0.1 + this.fish.jerkiness * 0.02);

      if (this.tension >= 100 || this.fishPosition >= 90) {
        clearInterval(this.gameLoop);
        this.isFishing = false;
        alert("Рыба сорвалась!");
      } else if (this.fishPosition <= 10) {
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

@keyframes bobberFloat {
  0% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(5px); }
  100% { transform: translate(-50%, -50%) translateY(0); }
}

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

  &__bobber {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    border: 2px solid white;
    animation: bobberFloat 1.5s infinite ease-in-out;
  }

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
    transition: .2s;
    width: 50px;
    transform-origin: center;
  }

  &__line {
    position: absolute;
    width: 2px;
    left: 50%;
    background: white;
    transform-origin: top center;
    transition:.2s;
    top: 0;
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
