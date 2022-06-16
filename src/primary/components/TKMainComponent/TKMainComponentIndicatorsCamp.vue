<template>
  <div>
    <TKCampIndicators />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKCampIndicators } from "./TKCampComponents";
@Component({
  components: {
    TKCampIndicators
  }
})
export default class TKMainComponentIndicatorsCamp extends Vue {}
</script>

<style scoped></style>
