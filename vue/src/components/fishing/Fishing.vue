<template>
  <div
    class="fishing"
    :style="{
      backgroundImage: 'url(' + selectedLocation.image + ')',
    }"
  >
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
        <p v-if="rodsInInventory.length === 0" class="fishing__warning">
          У вас нет удочек. Купите их в магазине.
        </p>
      </div>

      <div class="fishing__select-group">
        <label for="bait" class="fishing__label">Наживка:</label>
        <select v-model="selectedBait" id="bait" class="fishing__select">
          <option v-for="bait in baitsInInventory" :key="bait.id" :value="bait">
            {{ bait.name }} - {{ bait.quantity }} шт.
          </option>
        </select>
        <p v-if="baitsInInventory.length === 0" class="fishing__warning">
          У вас нет наживок. Купите их в магазине.
        </p>
      </div>

      <button
        @click="handleCatchFish"
        :disabled="!selectedRod || !selectedBait || selectedBait.quantity <= 0"
        class="fishing__button"
      >
        Ловить рыбу
      </button>

      <div v-if="warningMessage" class="fishing__info">
        <p>{{ warningMessage }}</p>
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
      warningMessage: "",
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
    caughtFish() {
      return this.inventory.filter((item) => item.type === "fish");
    },
  },
  methods: {
    ...mapActions(["catchFishAsync"]),

    handleCatchFish() {
      this.warningMessage = "";

      if (!this.selectedRod) {
        this.warningMessage = "Пожалуйста, выберите удочку.";
        return;
      }
      if (!this.selectedBait || this.selectedBait.quantity <= 0) {
        this.warningMessage = "Нужна наживка для ловли рыбы.";
        return;
      }
      if (!this.selectedLocation) {
        this.warningMessage = "Выберите локацию для ловли.";
        return;
      }

      this.catchFishAsync({
        rod: this.selectedRod,
        bait: this.selectedBait,
        location: this.selectedLocation,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.fishing {
  font-family: "Arial", sans-serif;
  padding: 20px;
  border-radius: 8px;
  color: white;
  position: relative;
  min-height: 500px;
  background-size: cover;
  background-position: center;

  &__content {
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  &__title {
    text-align: center;
    margin-bottom: 20px;
  }

  &__subtitle {
    margin: 10px 0;
  }

  &__select-group {
    margin-bottom: 15px;
  }

  &__label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  &__select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 100%;
  }

  &__button {
    padding: 10px 20px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    margin-top: 20px;
    transition: background-color 0.3s;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #4cae4c;
    }
  }

  &__warning {
    color: #ffcc00;
    font-size: 1rem;
    margin-top: 5px;
    text-align: center;
  }

  &__info {
    margin-top: 20px;
    font-size: 1rem;
    text-align: center;
    color: #ff6666;
  }
}
</style>
