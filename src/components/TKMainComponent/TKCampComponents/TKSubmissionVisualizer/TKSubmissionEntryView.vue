<template lang="html">
  <div class="tk-submission-entry-container">
    <TKSubmissionEntryTextView v-if="entry.type === 'text'" :entry="entry" />
    <TKSubmissionEntryAgePyramidChart
      class="tk-chart"
      v-else-if="entry.type === 'age_pyramid'"
      :entry="entry"
      :pdfInfos="pdfInfos"
    />
    <TKSubmissionEntryDoughnutChart
      class="tk-chart"
      v-else-if="entry.type === 'doughnut'"
      :entry="entry"
      :pdfInfos="pdfInfos"
    />
    <TKSubmissionEntryPolarChart
      class="tk-chart"
      v-else-if="entry.type === 'polar'"
      :entry="entry"
      :pdfInfos="pdfInfos"
    />
    <div class="tk-hseparator" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";

import TKSubmissionEntryAgePyramidChart from "./TKSubmissionEntryAgePyramidChart.vue";
import TKSubmissionEntryDoughnutChart from "./TKSubmissionEntryDoughnutChart.vue";
import TKSubmissionEntryPolarChart from "./TKSubmissionEntryPolarChart.vue";
import TKSubmissionEntryTextView from "./TKSubmissionEntryTextView.vue";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";

@Component({
  components: {
    TKSubmissionEntryAgePyramidChart,
    TKSubmissionEntryDoughnutChart,
    TKSubmissionEntryPolarChart,
    TKSubmissionEntryTextView
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;
}
</script>

<style scoped>
.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}

.tk-chart {
  margin-top: -1px;
  background-color: transparent;
  border-radius: 3px;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
