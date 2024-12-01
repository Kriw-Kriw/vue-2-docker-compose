<template>
  <div class="chart-container">
    <svg class="chart-container__svg" :width="canvasWidth" :height="canvasHeight">
      <g v-for="(lineSet, setIdx) in lines" :key="'line-set-' + setIdx">
        <g v-for="(line, idx) in lineSet" :key="'line-' + idx">
          <line v-bind="line" />
        </g>
      </g>
      <g v-for="(circleSet, setIdx) in circles" :key="'circle-set-' + setIdx">
        <g v-for="(circle, idx) in circleSet" :key="'circle-' + idx">
          <circle
            v-bind="circle"
            @mouseenter="(event) => handleMouseEnter(event, circle)"
            @mouseleave="() => handleMouseLeave()"
          />
        </g>
      </g>
    </svg>
    <div
      v-if="popover.visible"
      class="chart-container__popover"
      :style="{ left: popover.x + 'px', top: popover.y + 'px' }"
    >
      {{ popover.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: "GridSVG",
  props: {
    canvasWidth: {
      type: Number,
      required: true,
    },
    canvasHeight: {
      type: Number,
      required: true,
    },
    dataPoints: {
      type: Array,
      required: true,
      validator(value) {
        return value.every((dataSet) =>
          Array.isArray(dataSet) &&
          dataSet.every(
            (point) =>
              typeof point.x === "number" &&
              typeof point.y === "number" &&
              typeof point.color === "string"
          )
        );
      },
    },
    radius: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      popover: {
        visible: false,
        x: 0,
        y: 0,
        content: "",
      },
    };
  },
  computed: {
    circles() {
      return this.dataPoints.map((dataSet) =>
        dataSet.map((point) => ({
          cx: point.x,
          cy: this.canvasHeight - point.y,
          r: this.radius,
          fill: point.color,
          tooltip: `x: ${point.x}, y: ${point.y}`,
        }))
      );
    },
    lines() {
      return this.dataPoints.map((dataSet) =>
        dataSet.slice(1).map((point, i) => ({
          x1: dataSet[i].x,
          y1: this.canvasHeight - dataSet[i].y,
          x2: point.x,
          y2: this.canvasHeight - point.y,
          stroke: point.color,
          "stroke-width": 2,
        }))
      );
    },
  },
  methods: {
    handleMouseEnter(event, circle) {
      this.popover = {
        visible: true,
        x: event.clientX - 40,
        y: event.clientY - 60,
        content: circle.tooltip,
      };
    },
    handleMouseLeave() {
      this.popover.visible = false;
    },
  },
};
</script>

<style scoped lang="less">
.chart-container {
  position: relative;
  display: inline-block;

  &__svg {
    background: #f0f0f0;
    border: 1px solid #999;
  }

  &__popover {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
    font-size: 12px;
    pointer-events: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -100%);
  }
}
</style>