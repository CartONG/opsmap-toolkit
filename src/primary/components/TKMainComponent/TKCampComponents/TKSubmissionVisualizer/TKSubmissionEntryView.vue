<template lang="html">
  <div class="tk-submission-entry-container">
    <TKSubmissionEntryTextView v-if="entry.type === 'text'" :entry="entry" />
    <TKSubmissionEntryBulletView
      v-else-if="entry.type === 'bullet'"
      :entry="entry"
    />
    <div class="tk-chart-container" v-else>
      <TKSubmissionEntryAgePyramidChart
        class="tk-chart"
        v-if="entry.type === 'age_pyramid'"
        :entry="entry"
      />
      <TKSubmissionEntryDoughnutChart
        class="tk-chart"
        v-else-if="entry.type === 'doughnut'"
        :entry="entry"
      />
      <TKSubmissionEntryPolarChart
        class="tk-chart"
        v-else-if="entry.type === 'polar'"
        :entry="entry"
      />
    </div>
    <div
      v-if="entry.type === 'text' || entry.type === 'bullet'"
      class="tk-hseparator"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";

import TKSubmissionEntryAgePyramidChart from "./TKSubmissionEntryAgePyramidChart.vue";
import TKSubmissionEntryDoughnutChart from "./TKSubmissionEntryDoughnutChart.vue";
import TKSubmissionEntryPolarChart from "./TKSubmissionEntryPolarChart.vue";
import TKSubmissionEntryBulletView from "./TKSubmissionEntryBulletView.vue";
import TKSubmissionEntryTextView from "./TKSubmissionEntryTextView.vue";

@Component({
  components: {
    TKSubmissionEntryAgePyramidChart,
    TKSubmissionEntryDoughnutChart,
    TKSubmissionEntryPolarChart,
    TKSubmissionEntryBulletView,
    TKSubmissionEntryTextView
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;
}
</script>

<style scoped>
.tk-hseparator {
  background-color: var(--v-discrete-base);
  height: 1px;
  width: 100%;
}
.tk-chart-container {
  margin-top: -1px;
  background-color: var(--v-thematicBackground-base);
  padding-top: 5px;
  padding-bottom: 5px;
}
.tk-chart {
  background-color: white;
  border-radius: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
