<template>
  <svg class="chart-svg" :width="canvasWidth" :height="canvasHeight">
    <g v-for="(line, idx) in createLines()" :key="'line-' + idx">
      <line v-bind="line" />
    </g>
    <g v-for="(circle, idx) in createCircles()" :key="'circle-' + idx">
      <circle v-bind="circle" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "GridSVG",
  props: ["canvasWidth", "canvasHeight", "dataPoints", "radius"],
  methods: {
    createCircles() {
      return this.dataPoints.map((point) => ({
        cx: point.x,
        cy: this.canvasHeight - point.y,
        r: this.radius,
        fill: point.color,
      }));
    },
    createLines() {
      const lines = [];
      for (let i = 1; i < this.dataPoints.length; i++) {
        lines.push({
          x1: this.dataPoints[i - 1].x,
          y1: this.canvasHeight - this.dataPoints[i - 1].y,
          x2: this.dataPoints[i].x,
          y2: this.canvasHeight - this.dataPoints[i].y,
          stroke: this.dataPoints[i].color,
          "stroke-width": 2,
        });
      }
      return lines;
    },
  },
};
</script>

<style scoped>
.chart-svg {
  background: #f0f0f0;
  border: 1px solid #999;
}
</style>