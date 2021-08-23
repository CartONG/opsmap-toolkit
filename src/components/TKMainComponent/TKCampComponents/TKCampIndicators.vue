<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/app/TKOpsmapConfiguration";
import TKIndicatorComponent from "../TKIndicators/TKIndicator.vue";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import {
  TKIndicatorDescription,
  TKIndicatorDescriptionSiteOccupation,
  TKIndicatorType
} from "@/domain/opsmapConfig/TKIndicatorsDescription";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  indicator1: TKIndicator | null = null;
  indicator2: TKIndicator | null = null;
  indicator3: TKIndicator | null = null;

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChanged() {
    if (this.dataset.currentSubmission) {
      this.indicator1 = this.dataset.currentSubmission.indicators[0];
      this.indicator2 = this.dataset.currentSubmission.indicators[1];
      this.indicator3 = this.dataset.currentSubmission.indicators[2];
    } else {
      this.indicator1 = this.computeDefaultIndicator(
        this.appConfig.indicators.site[0]
      );
      this.indicator2 = this.computeDefaultIndicator(
        this.appConfig.indicators.site[1]
      );
      this.indicator3 = this.computeDefaultIndicator(
        this.appConfig.indicators.site[2]
      );
    }
  }

  computeDefaultIndicator(
    ref: TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation
  ): TKIndicator {
    if (ref.type === TKIndicatorType.OCCUPATION) {
      return {
        type: ref.type,
        valueNumber: -1,
        valueYesNoLabel: { en: "-" },
        nameLabel: ref.name,
        valueLabel: { en: "-" },
        iconOchaName: ref.iconOchaName
      };
    }

    return {
      type: ref.type,
      nameLabel: ref.name,
      valueLabel: { en: "-" },
      iconOchaName: ref.iconOchaName
    };
  }
}
</script>

<style scoped>
.tk-camp-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: top;
  column-gap: 5%;
  row-gap: 10px;
}

.tk-camp-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
