<template>
  <div class="tk-home-content-layout">
    <TKHomeMoreInfos />
    <TKIFrame
      v-if="appConfig.iframe && appConfig.iframe.display"
      :url="appConfig.iframe.url"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKIFrame from "@/primary/components/TKExtras/TKIFrame.vue";
import { TKHomeMoreInfos } from "./TKHomeComponents";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component({
  components: {
    TKIFrame,
    TKHomeMoreInfos
  }
})
export default class TKMainComponentLeftHome extends Vue {
  get appConfig() {
    return TKConfigurationModule.configuration;
  }
}
</script>

<style scoped>
.tk-home-content-layout {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}
</style>
