<template>
  <div class="tk-home-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TKIndicatorComponent from "../TKIndicators/TKIndicator.vue";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKHomeIndicators extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  indicator1: TKIndicator | null = null;
  indicator2: TKIndicator | null = null;
  indicator3: TKIndicator | null = null;

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    this.indicator1 = this.dataset.currentSurvey
      ? this.dataset.currentSurvey.indicators[0]
      : null;
    this.indicator2 = this.dataset.currentSurvey
      ? this.dataset.currentSurvey.indicators[1]
      : null;
    this.indicator3 = this.dataset.currentSurvey
      ? this.dataset.currentSurvey.indicators[2]
      : null;
  }
}
</script>

<style scoped>
.tk-home-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: top;
  column-gap: 5%;
  row-gap: 10px;
}

.tk-home-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
