<template>
  <GridSVG
    :canvasWidth="600"
    :canvasHeight="600"
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
        { x: 11, y: 33, color: "#ff6347" },
        { x: 123, y: 234, color: "#4682b4" },
        { x: 500, y: 500, color: "#3cb371" },
        { x: 123, y: 321, color: "#dda0dd" },
      ],
    };
  },
};
</script>
