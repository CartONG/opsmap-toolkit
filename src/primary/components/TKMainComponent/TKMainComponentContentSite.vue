<template>
  <div>
    <TKSubmissionVisualizerToolbar
      v-show="showVisualizerOptions"
      class="toolbar"
    />
    <TKSubmissionVisualizer />
  </div>
</template>

<script lang="ts">
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import { Component, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerToolbar
} from "./TKSiteComponents";
@Component({
  components: {
    TKSubmissionVisualizer,
    TKSubmissionVisualizerToolbar
  }
})
export default class TKMainComponentContentSite extends Vue {
  get showVisualizerOptions() {
    return TKVisualizerOptionsModule.showVisualizerOptions;
  }
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}
</style>
