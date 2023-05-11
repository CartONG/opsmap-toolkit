<template lang="html">
  <div class="tk-submission-visualizer">
    <div
      v-for="(col, indexcol) in columns"
      :key="indexcol"
      class="tk-submission-visualizer-col"
    >
      <TKSubmissionThematicView
        v-for="(them, indexthem) in col"
        :key="indexthem"
        :submissionThematic="them"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import TKSubmissionThematicView from "./TKSubmissionThematicView.vue";
import { TKTFDFhematicsCollection } from "@/domain/fdf/TKFDFThematics";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import {
  TKSubmissionEntryAgePyramid,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryPolar,
  TKSubmissionEntryRadar,
  TKSubmissionEntryText,
  TKSubmissionEntryType
} from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

function computeChartDoughnutScore(chart: TKSubmissionEntryDoughnut): number {
  const CHART_DOUGHNUT_BASE = 6;
  const CHART_DOUGHNUT_LINE_FACTOR = 3;
  return (
    chart.entries.length / CHART_DOUGHNUT_LINE_FACTOR + CHART_DOUGHNUT_BASE
  );
}

function computeChartPolarScore(chart: TKSubmissionEntryPolar): number {
  const CHART_POLAR_BASE = 6;
  const CHART_POLAR_LINE_FACTOR = 3;
  return chart.entries.length / CHART_POLAR_LINE_FACTOR + CHART_POLAR_BASE;
}

function computeChartPyramidScore(chart: TKSubmissionEntryAgePyramid): number {
  const CHART_PYRAMID_BASE = 4;
  const CHART_PYRAMID_LINE_FACTOR = 3;
  return (
    chart.femalesLabels.length / CHART_PYRAMID_LINE_FACTOR + CHART_PYRAMID_BASE
  );
}

function computeChartRadarScore(chart: TKSubmissionEntryRadar): number {
  const CHART_RADAR_BASE = 6;
  const CHART_RADAR_LINE_FACTOR = 3;
  return chart.entries.length / CHART_RADAR_LINE_FACTOR + CHART_RADAR_BASE;
}

function computeTextScore(text: TKSubmissionEntryText): number {
  const AVERAGE_CHAR_COUNT_PER_LINE = 90;
  return Math.ceil(
    (TKGetLocalValue(text.fieldLabel, "en").length +
      TKGetLocalValue(text.answerLabel, "en").length) /
      AVERAGE_CHAR_COUNT_PER_LINE
  );
}

function computeScore(thematic: TKSubmissionThematic): number {
  return thematic.data.reduce((previousScore, thematicData) => {
    let score = 1;
    switch (thematicData.type) {
      case TKSubmissionEntryType.BULLET:
        score = thematicData.answersLabels.length;
        break;
      case TKSubmissionEntryType.CHART_DOUGHNUT:
        score = computeChartDoughnutScore(thematicData);
        break;
      case TKSubmissionEntryType.CHART_POLAR:
        score = computeChartPolarScore(thematicData);
        break;
      case TKSubmissionEntryType.CHART_PYRAMID:
        score = computeChartPyramidScore(thematicData);
        break;
      case TKSubmissionEntryType.CHART_RADAR:
        score = computeChartRadarScore(thematicData);
        break;
      case TKSubmissionEntryType.TEXT:
        score = computeTextScore(thematicData);
        break;
    }
    return previousScore + score;
  }, 0);
}

@Component({
  components: {
    TKSubmissionThematicView
  }
})
export default class TKSubmissionVisualizer extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  thematics!: TKTFDFhematicsCollection;

  columns: [
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>
  ] = [[], [], []];

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChanged() {
    this.columns[LEFT] = [];
    this.columns[MIDDLE] = [];
    this.columns[RIGHT] = [];

    const scores = [0, 0, 0];
    if (this.dataset) {
      // Adjust to Submission content
      if (this.dataset.currentSubmission) {
        // Follow FDF order, line by line
        if (
          TKConfigurationModule.configuration.options.keepThematicOrderFromFDF
        ) {
          let index = 0;
          for (const thematic in this.dataset.currentSubmission.thematics) {
            this.columns[index];
            this.columns[index].push(
              this.dataset.currentSubmission.thematics[thematic]
            );
            index++;
            if (index > 2) {
              index = 0;
            }
          }
          // Optimize a bit the display
        } else {
          for (const thematic in this.dataset.currentSubmission.thematics) {
            let index = LEFT;
            if (
              scores[MIDDLE] < scores[LEFT] &&
              scores[MIDDLE] <= scores[RIGHT]
            ) {
              index = MIDDLE;
            } else if (
              scores[RIGHT] < scores[MIDDLE] &&
              scores[RIGHT] < scores[LEFT]
            ) {
              index = RIGHT;
            }
            this.columns[index].push(
              this.dataset.currentSubmission.thematics[thematic]
            );

            // Increment item count.
            scores[index] += computeScore(
              this.dataset.currentSubmission.thematics[thematic]
            );
          }
        }

        // Follow descriptiopn order
      } else if (this.thematics) {
        let index = 0;
        for (const i in this.thematics) {
          const thematicsDescr = this.thematics[i];
          this.columns[index].push({
            data: [],
            nameLabel: thematicsDescr.thematicLabel,
            formattedName: thematicsDescr.formattedName,
            iconFileName: thematicsDescr.iconFileName
          });

          index++;
          if (index > 2) {
            index = 0;
          }
        }
      }
    }

    this.$forceUpdate();
  }

  @Watch("dataset.currentSurvey", { immediate: true })
  onDatasetChange() {
    if (this.dataset && this.dataset.currentSurvey) {
      this.thematics = this.dataset.currentSurvey.fdf.thematics;

      this.onSubmissionChanged();
    }
  }
}
</script>

<style>
.tk-submission-visualizer {
  display: flex;
  flex-flow: row wrap;
  column-gap: 5%;
  row-gap: 25px;
  justify-content: left;
  align-items: top;
}

.tk-submission-visualizer-col {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  row-gap: 25px;
  min-width: 300px;
}
</style>
