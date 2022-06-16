<template>
  <div class="tk-camp-left">
    <TKCampSubtitle />
    <TKCampToolbar />
    <TKCampInfos />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKCampInfos, TKCampSubtitle, TKCampToolbar } from "./TKCampComponents";
@Component({
  components: {
    TKCampInfos,
    TKCampSubtitle,
    TKCampToolbar
  }
})
export default class TKMainComponentLeftHome extends Vue {}
</script>

<style scoped>
.tk-camp-left {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
}
</style>
