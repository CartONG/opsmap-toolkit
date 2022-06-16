<template>
  <div class="tk-placeholder-indicators">
    <div class="tk-placeholder-indicator-item">
      <TKPlaceHolderGeneric />
    </div>
    <div class="tk-placeholder-indicator-item">
      <TKPlaceHolderGeneric />
    </div>
    <div class="tk-placeholder-indicator-item">
      <TKPlaceHolderGeneric />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKPlaceHolderGeneric from "./TKPlaceHolderGeneric.vue";

@Component({
  components: {
    TKPlaceHolderGeneric
  }
})
export default class TKPlaceHolderIndicators extends Vue {}
</script>

<style scoped>
.tk-placeholder-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-placeholder-indicator-item {
  box-shadow: 0 0 20px 2px rgba(18, 63, 98, 0.15);
  border-color: transparent;
  border-radius: 5px;
  min-height: 100px;
  overflow: hidden;
  width: 30%;
  border-radius: 15px;
}
</style>
