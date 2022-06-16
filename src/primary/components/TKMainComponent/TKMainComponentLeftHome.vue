<template>
  <div class="tk-home-left">
    <TKHomeSubtitle />
    <TKHomeCombos />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKHomeCombos, TKHomeSubtitle } from "./TKHomeComponents";
@Component({
  components: {
    TKHomeCombos,
    TKHomeSubtitle
  }
})
export default class TKMainComponentLeftHome extends Vue {}
</script>

<style scoped>
.tk-home-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  align-items: left;
}
</style>
