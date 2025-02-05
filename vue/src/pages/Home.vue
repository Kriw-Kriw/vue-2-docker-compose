<template>
  <div class="home">
    <h1>Выберите локацию для рыбалки</h1>
    <ul>
      <li v-for="location in locations" :key="location.id">
        <button @click="selectLocation(location)">
          {{ location.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["availableLocations"]),
  },
  methods: {
    selectLocation(location) {
      this.$store.commit("setLocation", location);
      this.$router.push({ name: "fishing" });
    },
  },
};
</script>
