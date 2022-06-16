<template>
  <div class="tk-placeholder-left">
    <TKPlaceHolderGeneric class="tk-placeholder-left-title" />
    <TKPlaceHolderGeneric class="tk-placeholder-left-title" />
    <TKPlaceHolderGeneric class="tk-placeholder-left-combos" />
    <TKPlaceHolderGeneric class="tk-placeholder-left-combos" />
    <TKPlaceHolderGeneric class="tk-placeholder-left-combos" />
    <TKPlaceHolderGeneric class="tk-placeholder-left-combos" />
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
export default class TKPlaceHolderLeft extends Vue {}
</script>

<style scoped>
.tk-placeholder-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
  row-gap: 5px;
  height: 100%;
  position: relative;
}

.tk-placeholder-left-title {
  width: 40%;
}

.tk-placeholder-left-combos {
  min-height: 45px;
  width: 100%;
}
</style>
