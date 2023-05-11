<template>
  <div>
    <TKSiteIndicators />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKSiteIndicators } from "./TKSiteComponents";
@Component({
  components: {
    TKSiteIndicators
  }
})
export default class TKMainComponentIndicatorsSite extends Vue {}
</script>

<style scoped></style>
