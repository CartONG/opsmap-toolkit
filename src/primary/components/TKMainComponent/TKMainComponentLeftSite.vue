<template>
  <div class="tk-site-left">
    <TKSiteSubtitle />
    <TKSiteToolbar />
    <TKSiteInfos />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKSiteInfos, TKSiteSubtitle, TKSiteToolbar } from "./TKSiteComponents";
@Component({
  components: {
    TKSiteInfos,
    TKSiteSubtitle,
    TKSiteToolbar
  }
})
export default class TKMainComponentLeftHome extends Vue {}
</script>

<style scoped>
.tk-site-left {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
}
</style>
