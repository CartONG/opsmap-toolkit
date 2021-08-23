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
        :visualizerOptions="visualizerOptions"
        :submissionThematic="them"
        :pdfInfos="pdfInfos"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TKSubmissionThematicView from "./TKSubmissionThematicView.vue";
import { TKTFDFhematicsCollection } from "@/domain/fdf/TKFDFThematics";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizerOptions";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";

@Component({
  components: {
    TKSubmissionThematicView
  }
})
export default class TKSubmissionVisualizer extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  thematics!: TKTFDFhematicsCollection;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;

  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  columns: [
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>
  ] = [[], [], []];

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChanged() {
    this.columns[0] = [];
    this.columns[1] = [];
    this.columns[2] = [];

    const itemsCount = [0, 0, 0];
    if (this.dataset) {
      if (this.dataset.currentSubmission) {
        for (const them in this.dataset.currentSubmission.thematics) {
          let index = 0;
          if (itemsCount[1] < itemsCount[0] && itemsCount[1] <= itemsCount[2]) {
            index = 1;
          } else if (
            itemsCount[2] < itemsCount[1] &&
            itemsCount[2] < itemsCount[0]
          ) {
            index = 2;
          }
          this.columns[index].push(
            this.dataset.currentSubmission.thematics[them]
          );
          itemsCount[index] += this.dataset.currentSubmission.thematics[
            them
          ].data.length;
        }
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

<style scoped>
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
