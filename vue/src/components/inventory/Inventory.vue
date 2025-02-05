<template>
  <div class="inventory">
    <div class="inventory__header">
      <h1 class="inventory__title">Инвентарь</h1>
      <p class="inventory__balance">Ваш баланс: {{ coins }} монет</p>
    </div>
    <div class="inventory__items">
      <div v-for="item in inventory" :key="item.id" class="inventory__item">
        <p class="inventory__name">{{ item.name }} (x{{ item.quantity }})</p>
        <div class="inventory__tags">
          <span v-if="item.type === 'fish'" class="inventory__tag">Рыба</span>
          <span v-if="item.type === 'bait'" class="inventory__tag">Наживка</span>
          <span v-if="item.type === 'rod'" class="inventory__tag">Удочка</span>
        </div>
        <div class="inventory__bottom">
          <button @click="sellItem(item)" class="inventory__button">Продать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "InventoryPage",
  computed: {
    ...mapGetters(["inventory", "coins"]),
  },
  methods: {
    ...mapMutations(["sellFish"]),
    sellItem(item) {
      this.sellFish(item);
    }
  },
};
</script>

<style lang="less" scoped>
.inventory {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-image: url("https://images.freeimages.com/images/large-previews/f5c/wood-texture-1143636.jpg");
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    color: white;
  }

  &__title {
    margin: 0;
  }

  &__balance {
    margin: 0;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
  }

  &__item {
    width: 200px;
    height: 150px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }

  &__name {
    font-size: 1rem;
    font-weight: bold;
    color: #444;
  }

  &__tags {
    margin-top: 10px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  &__tag {
    background-color: #dcdcdc;
    padding: 3px 10px;
    font-size: 0.8rem;
    border-radius: 20px;
    color: #333;
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    padding: 10px;
  }

  &__button {
    padding: 5px 20px;
    font-size: 1rem;
    color: white;
    background-color: #5cb85c;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #4cae4c;
    }
  }
}
</style>
