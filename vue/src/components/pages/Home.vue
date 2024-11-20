<template>
  <PageLayout>
    <section class="p-16">
      Homepage
      <button @click="() => openHelpModal()">Open modal</button>
    </section>
    <section>
      <GridSVGLayout />
    </section>
  </PageLayout>
</template>

<script>
import PageLayout from '../parts/PageLayout'
import GridSVGLayout from "../gridSVG/GridSVGLayout";
import { helpModal } from "@/mixins/modals";

export default {
name: 'HomePage',
mixins: [helpModal],
components: {
  PageLayout,
  GridSVGLayout
}
}
</script>

<style>
</style>