<template>
  <div class="locations">
    <h1 class="locations__tittle">Выберите локацию</h1>
    <div class="locations__list">
      <div
        v-for="location in availableLocations"
        :key="location.id"
        class="location"
        @click="selectLocation(location)"
      >
        <img :src="location.image" :alt="location.name" class="location__image" />
        <p class="location__name">{{ location.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LocationsPage",
  computed: {
    availableLocations() {
      return this.$store.getters.availableLocations;
    },
  },
  methods: {
    selectLocation(location) {
      this.$store.commit("setLocation", location);
      this.$router.push("/fishing");
    },
  },
};
</script>

<style scoped lang="less">
.locations {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("https://images.freeimages.com/images/large-previews/f5c/wood-texture-1143636.jpg");
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__tittle {
    font-size: 24px;
    color: white;
    margin-bottom: 20px;
    font-family: "Arial";
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .location {
    cursor: pointer;
    margin: 10px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }

  .location__image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }

  .location__name {
    font-size: 18px;
    margin-top: 10px;
    color: #555;
  }
}
</style>
