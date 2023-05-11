<template lang="html">
  <div>
    <TKSubmissionEntryTextView v-if="entry.type === 'text'" :entry="entry" />
    <TKSubmissionEntryBulletView
      v-else-if="entry.type === 'bullet'"
      :entry="entry"
    />
    <div v-else class="tk-chart-container">
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
      <TKSubmissionEntryRadarChart
        class="tk-chart"
        v-else-if="entry.type === 'radar'"
        :entry="entry"
      />
    </div>
    <div
      v-if="entry.type === 'text' || entry.type === 'bullet'"
      class="tk-hseparator"
    ></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";

import TKSubmissionEntryAgePyramidChart from "./TKSubmissionEntryAgePyramidChart.vue";
import TKSubmissionEntryDoughnutChart from "./TKSubmissionEntryDoughnutChart.vue";
import TKSubmissionEntryPolarChart from "./TKSubmissionEntryPolarChart.vue";
import TKSubmissionEntryRadarChart from "./TKSubmissionEntryRadarChart.vue";
import TKSubmissionEntryBulletView from "./TKSubmissionEntryBulletView.vue";
import TKSubmissionEntryTextView from "./TKSubmissionEntryTextView.vue";

@Component({
  components: {
    TKSubmissionEntryAgePyramidChart,
    TKSubmissionEntryDoughnutChart,
    TKSubmissionEntryPolarChart,
    TKSubmissionEntryRadarChart,
    TKSubmissionEntryBulletView,
    TKSubmissionEntryTextView
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;
}
</script>
<style>
.tk-hseparator {
  background-color: var(--v-discrete-base);
  height: 1px;
  width: 100%;
}

.tk-chart-container {
  margin-top: -1px;
  background-color: var(--v-thematicBackground-base);
  padding-bottom: 5px;
  padding-top: 5px;
  width: 100%;
}

.tk-chart {
  background-color: rgba(245, 243, 232, 0.5);
  border-radius: 4px;
  width: 100%;
}

.tk-submission-entry-container {
  min-width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-height: 30px;
  column-gap: 2px;
  font-weight: bold;
  font-size: 11px;
}

.tk-entry-field-name {
  color: var(--v-secondary-base);
  font-family: Arial;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0px;
  text-align: left;
  overflow: auto;
  flex-grow: 2;
  min-width: 20%;
}

.tk-entry-field-name-arab {
  text-align: right;
}

.tk-entry-field-value {
  color: var(--v-primary-base);
  font-family: Arial;
  font-size: 11px;
  font-weight: 700;
  line-height: 13px;
  letter-spacing: 0px;
  min-width: 20%;
  text-align: right;
}
.tk-entry-field-value-arab {
  margin-left: 16px;
  text-align: left;
}

.tk-trafficlight-container {
  margin-right: -20px;
}

.tk-trafficlight {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: none;
}
</style>
