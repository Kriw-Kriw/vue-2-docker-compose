<template>
  <div class="app">
    <NavbarComponent />
    <div class="app__content">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavbarComponent from "./navbar/NavbarComponent.vue";

export default {
  name: "App",
  components: {
    NavbarComponent,
  },
};
</script>

<style lang="less" scoped>
.app {
  &__content {
    padding: 16px;
  }
}
</style>
