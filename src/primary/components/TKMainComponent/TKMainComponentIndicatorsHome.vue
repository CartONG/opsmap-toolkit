<template>
  <div>
    <TKHomeIndicators class="tk-home-indicators" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKHomeIndicators } from "./TKHomeComponents";
@Component({
  components: {
    TKHomeIndicators
  }
})
export default class TKMainComponentIndicatorsSite extends Vue {}
</script>

<style scoped></style>
