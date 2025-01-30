<template>
  <div class="alchemist-game">
    <h2 class="alchemist-game__title">Инвентарь</h2>
    <div class="alchemist-game__inventory">
      <div 
        v-for="item in inventory" 
        :key="item.id" 
        class="alchemist-game__inventory-item" 
        @click="() => addToTable(item)"
      >
        <span class="alchemist-game__inventory-item-name">{{ item.name }}</span>
        <img :src="getItemImage(item.name)" alt="item.name" class="alchemist-game__inventory-item-image" />
        <span class="alchemist-game__inventory-item-count">{{ item.count }}</span>
      </div>
    </div>

    <div class="alchemist-game__table">
      <h2 class="alchemist-game__title">Стол для смешивания</h2>
      <div class="alchemist-game__table-items">
        <div 
          v-for="(item, index) in table" 
          :key="index" 
          class="alchemist-game__table-item"
        >
          <div class="alchemist-game__table-item-tittle">
            <button @click="() => decreaseCount(index)" class="alchemist-game__button-minus"><p>-</p></button>
            <div>{{ item.name }} ({{ item.count }})</div>
            <button @click="() => increaseCount(index)" class="alchemist-game__button-plus"><p>+</p></button>
          </div>
        </div>
      </div>
      <div class="alchemist-game__table-actions">
        <button @click="() => resetTable()" class="alchemist-game__button">Сбросить</button>
        <button @click="() => mixItems()" class="alchemist-game__button">Смешать</button>
      </div>
      <p class="alchemist-game__mix-message" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import data from "./alchemist-data.json";

export default {
  name: "AlchimickComponent",
  data() {
    return {
      items: data.items,
      inventory: data.inventory,
      recipes: data.recipes,
      table: [],
      message: "",
    };
  },
  methods: {
    getItemImage(itemName) {
      return this.items[itemName] ? this.items[itemName].image : '';
    },

    addToTable(item) {
      const inventoryItem = this.inventory.find((inv) => inv.name === item.name);
      if (inventoryItem.count > 0) {
        inventoryItem.count--;
        const tableItem = this.table.find((tableItem) => tableItem.name === item.name);
        if (tableItem) {
          tableItem.count++;
        } else {
          this.table.push({ name: item.name, count: 1, image: this.getItemImage(item.name) });
        }
      } else {
        this.message = `Недостаточно ${item.name} в инвентаре!`;
      }
    },

    increaseCount(index) {
      const item = this.table[index];
      const inventoryItem = this.inventory.find((inv) => inv.name === item.name);
      if (inventoryItem.count > item.count) {
        item.count++;
      } else {
        this.message = `Недостаточно ${item.name} в инвентаре для увеличения!`;
      }
    },

    decreaseCount(index) {
      const item = this.table[index];
      if (item.count > 1) {
        item.count--;
      } else {
        const inventoryItem = this.inventory.find((inv) => inv.name === item.name);
        inventoryItem.count++;
        this.table.splice(index, 1);
      }
    },

    resetTable() {
      this.table.forEach((item) => {
        const inventoryItem = this.inventory.find((inv) => inv.name === item.name);
        inventoryItem.count += item.count;
      });
      this.table = [];
      this.message = "";
    },

    mixItems() {
      const ingredients = this.table
        .flatMap((item) => Array(item.count).fill(item.name))
        .sort();

      const recipe = this.recipes.find((recipe) => {
        const sortedRecipeIngredients = recipe.ingredients.sort();
        return sortedRecipeIngredients.join() === ingredients.join();
      });

      if (recipe) {
        let canCraft = true;
        const requiredIngredients = recipe.ingredients.reduce((acc, ingredient) => {
          acc[ingredient] = (acc[ingredient] || 0) + 1;
          return acc;
        }, {});

        this.table.forEach(item => {
          if (requiredIngredients[item.name] && item.count > requiredIngredients[item.name]) {
            canCraft = false;
          }
        });

        if (canCraft) {
          recipe.ingredients.forEach(ingredient => {
            const inventoryItem = this.inventory.find((inv) => inv.name === ingredient);
            inventoryItem.count--;
          });

          const resultItem = this.inventory.find((item) => item.name === recipe.result);
          if (resultItem) {
            resultItem.count++;
          } else {
            this.inventory.push({ id: this.inventory.length + 1, name: recipe.result, count: 1, image: this.getItemImage(recipe.result) });
          }
          this.resetTable();
        } else {
          this.message = "❌ Неудача: Недостаточно ингредиентов для крафта.";
        }
      } else {
        this.message = "❌ Неудача: Никакой реакции не произошло.";
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "styles/styles.less";
</style>
