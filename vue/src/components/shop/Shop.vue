<template>
  <div class="shop">
    <h1 class="shop__title">Магазин</h1>
    <div class="shop__items">
      <div
        v-for="item in rods"
        :key="item.id"
        class="shop__item"
        @click="buyItem(item)"
      >
        <p class="shop__name">{{ item.name }}</p>
        <div class="shop__bottom">
          <p class="shop__price">Стоимость: {{ item.price }} монет</p>
          <span class="shop__tag">Удочка</span>
        </div>
      </div>
      <div
        v-for="item in baits"
        :key="item.id"
        class="shop__item"
        @click="buyItem(item)"
      >
        <p class="shop__name">{{ item.name }}</p>
        <div class="shop__bottom">
          <p class="shop__price">Стоимость: {{ item.price }} монет</p>
          <span class="shop__tag">Наживка</span>
        </div>
      </div>
    </div>
    <p class="shop__balance">Ваш баланс: {{ coins }} монет</p>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "ShopPage",
  computed: {
    ...mapGetters(["coins", "rods", "baits"]),
  },
  methods: {
    ...mapMutations(["buyItem"]),
  },
};
</script>

<style scoped lang="less">
.shop {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-image: url("https://images.freeimages.com/images/large-previews/f5c/wood-texture-1143636.jpg");
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__title {
    font-size: 2rem;
    text-align: center;
    color: white;
    margin-bottom: 20px;
  }

  &__items {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  &__item {
    width: 200px;
    height: 150px;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }

  &__name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #444;
    margin: 10px 0;
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    padding: 10px;
  }

  &__price {
    font-size: 1rem;
    color: #888;
    margin-bottom: 5px;
  }

  &__tag {
    display: inline-block;
    padding: 5px 10px;
    font-size: 0.9rem;
    color: white;
    background-color: #5cb85c;
    border-radius: 12px;
  }

  &__balance {
    font-size: 1.2rem;
    text-align: center;
    color: white;
    font-weight: bold;
    margin-top: 30px;
  }
}
</style>
