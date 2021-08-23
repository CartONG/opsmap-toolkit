<template>
  <div class="tk-home-content-layout">
    <TKHomeMoreInfos :appConfig="appConfig" />
    <TKIFrame
      v-if="appConfig.iframe && appConfig.iframe.display"
      :url="appConfig.iframe.url"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TKIFrame from "@/components/TKExtras/TKIFrame.vue";
import { TKHomeMoreInfos } from "./TKHomeComponents";
import { TKOpsmapConfiguration } from "@/domain";

@Component({
  components: {
    TKIFrame,
    TKHomeMoreInfos
  }
})
export default class TKMainComponentLeftHome extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
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
