<template>
  <div class="tk-home-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TKIndicatorComponent from "../TKIndicators/TKIndicator.vue";
import { TKIndicator, TKIndicatorDefault } from "@/domain/survey/TKIndicator";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKHomeIndicators extends Vue {
  indicator1: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.home[0]
  );
  indicator2: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.home[1]
  );
  indicator3: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.home[2]
  );

  get dataset() {
    return TKDatasetModule.dataset;
  }

  @Watch("dataset.lastModification")
  onLastModification() {
    if (!this.dataset.currentCamp) {
      if (this.dataset.currentAdmin2) {
        this.indicator1 = this.dataset.currentSurvey.indicators[
          this.dataset.currentAdmin2.pcode
        ][0];
        this.indicator2 = this.dataset.currentSurvey.indicators[
          this.dataset.currentAdmin2.pcode
        ][1];
        this.indicator3 = this.dataset.currentSurvey.indicators[
          this.dataset.currentAdmin2.pcode
        ][2];
      } else {
        if (this.dataset.currentAdmin1) {
          this.indicator1 = this.dataset.currentSurvey.indicators[
            this.dataset.currentAdmin1.pcode
          ][0];
          this.indicator2 = this.dataset.currentSurvey.indicators[
            this.dataset.currentAdmin1.pcode
          ][1];
          this.indicator3 = this.dataset.currentSurvey.indicators[
            this.dataset.currentAdmin1.pcode
          ][2];
        } else {
          this.indicator1 = this.dataset.currentSurvey.indicators[""][0];
          this.indicator2 = this.dataset.currentSurvey.indicators[""][1];
          this.indicator3 = this.dataset.currentSurvey.indicators[""][2];
        }
      }
    }
  }

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    if (this.dataset.currentSurvey) {
      this.indicator1 = this.dataset.currentSurvey.indicators[""][0];
      this.indicator2 = this.dataset.currentSurvey.indicators[""][1];
      this.indicator3 = this.dataset.currentSurvey.indicators[""][2];
    } else {
      this.indicator1 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.home[0]
      );
      this.indicator2 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.home[1]
      );
      this.indicator3 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.home[2]
      );
    }
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
