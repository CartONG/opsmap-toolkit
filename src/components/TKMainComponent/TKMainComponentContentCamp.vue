<template>
  <div>
    <TKSubmissionVisualizer
      :visualizerOptions="visualizerOptions"
      :dataset="dataset"
      :pdfInfos="pdfInfos"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";
@Component({
  components: {
    TKSubmissionVisualizer
  }
})
export default class TKMainComponentLeftCamp extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;
}
</script>

<style scoped></style>
