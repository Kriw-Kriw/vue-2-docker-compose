<template>
  <nav class="navbar">
    <ul class="navbar__menu">
      <li class="navbar__item" v-for="link in links" :key="link.name">
        <router-link :to="link.path" class="navbar__item__link">{{ link.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  data() {
    return {
      links: [
        { name: "Водоемы", path: "/locations" },
        { name: "Инвентарь", path: "/inventory" },
        { name: "Магазин", path: "/shop" },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.navbar {
  background: #2a2a2a;
  padding: 10px;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.navbar__menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.navbar__item {
  &__link {
    text-decoration: none;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 5px;
    transition: color 0.2s, background-color 0.3s;
    
    &:hover {
      color: #fff;
      background-color: #444;
    }

    &.router-link-active {
      background-color: #666;
      color: #f0f0f0;
    }
  }
}
</style>
