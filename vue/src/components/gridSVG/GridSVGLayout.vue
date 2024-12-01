<template>
  <GridSVG
    :canvasWidth="400"
    :canvasHeight="400"
    :dataPoints="chartData"
    :radius="8"
  />
</template>

<script>
import GridSVG from "./GridSVG.vue";

export default {
  name: "GridSVGLayout",
  components: {
    GridSVG,
  },
  data() {
    return {
      chartData: [
        [
          { x: 50, y: 50, color: "#ff6347" },
          { x: 100, y: 200, color: "#ff6347" },
          { x: 250, y: 100, color: "#ff6347" },
        ],
        [
          { x: 190, y: 280, color: "#4682b4" },
          { x: 160, y: 200, color: "#4682b4" },
          { x: 300, y: 190, color: "#4682b4" },
        ],
      ],
    };
  },
};
</script>