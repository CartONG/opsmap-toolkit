<template>
  <div class="indicators-container">
    <div
      class="indicator"
      v-for="(indicator, index) in indicators"
      :indicator="indicator"
      :key="index"
    >
      <div class="indicator-container" v-if="indicator.type === 'standard'">
        <div class="indicator-icon-container">
          <img class="indicator-icon" :src="indicator.iconUrl" />
        </div>
        <div class="indicator-value">
          <div class="indicator-value-number">
            {{ indicator.value }}
          </div>
          <div class="indicator-value-decription">
            {{ indicator.name }}
          </div>
        </div>
      </div>
      <div
        class="indicator-container"
        v-else-if="indicator.type === 'occupation'"
      >
        <div class="indicator-icon-container">
          <img class="indicator-icon" :src="indicator.iconUrl" />
        </div>
        <div class="indicator-value">
          <div class="indicator-value-number">
            {{ indicator.labelCenterOfProgress }}
          </div>
          <div class="indicator-value-decription">
            {{ indicator.name }}: {{ indicator.labelYesNo }}
          </div>
        </div>
      </div>
      <!-- <div
        class="indicator-container-occupation"
        v-else-if="indicator.type === 'occupation'"
      >
        <v-progress-linear
          :value="indicator.value"
          height="30"
          rounded
          :color="indicator.color"
          readonly
        >
          <strong>{{ indicator.labelCenterOfProgress }}</strong>
        </v-progress-linear>
        <div class="indicator-value-decription">
          <span>{{ indicator.name }} : </span>
          <span>{{ indicator.labelYesNo }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { TKIndicatorType } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class TKSubmissionToPDFIndicator extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  indicators: Array<
    | {
        type: "standard";
        iconUrl: string;
        name: string;
        value: string;
      }
    | {
        type: "occupation";
        iconUrl: string;
        value: number;
        name: string;
        labelCenterOfProgress: string;
        labelValue: string;
        labelYesNo: string;
        color: string;
      }
  > = [];

  @Watch("$root.$i18n.locale", { immediate: true })
  @Watch("dataset.currentSubmission", { immediate: true })
  indicatorChanged() {
    if (this.dataset && this.dataset.currentSubmission) {
      this.indicators = this.dataset.currentSubmission.indicators.map(item => {
        if (item.type === TKIndicatorType.OCCUPATION) {
          return {
            type: "occupation",
            name: TKGetLocalValue(item.nameLabel, this.$root.$i18n.locale),
            iconUrl: TKIconUrl(item.iconOchaName),
            labelValue: TKGetLocalValue(
              item.valueLabel,
              this.$root.$i18n.locale
            ),
            labelYesNo: TKGetLocalValue(
              item.valueYesNoLabel,
              this.$root.$i18n.locale
            ),
            value: item.valueNumber,
            labelCenterOfProgress: `${item.valueNumber}%`,
            color: this.computeColor(item.valueNumber)
          };
        } else {
          return {
            type: "standard",
            iconUrl: TKIconUrl(item.iconOchaName),
            name: TKGetLocalValue(item.nameLabel, this.$root.$i18n.locale),
            value: TKGetLocalValue(item.valueLabel, this.$root.$i18n.locale)
          };
        }
      });
    } else {
      this.indicators = [];
    }
  }

  computeColor(value: number): string {
    if (value === undefined) return "#E0E0E0";
    if (value < 80) return "green";
    if (value < 90) return "yellow";
    if (value < 100) return "orange";
    return "#e91d1d";
  }
}
</script>

<style scoped>
/* INDICATORS ********************************************************/
.indicators-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: top;
}

.indicator {
  height: 20mm;
  width: 60mm;
}

.indicator-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  column-gap: 5mm;
  padding-top: 5mm;
  padding-left: 5mm;
  align-items: left;
  width: 100%;
  height: 100%;
}

.indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  height: 100%;
  width: 100%;
}

.indicator-value-number {
  width: 100%;
  color: var(--v-accent-base);
  font-size: 16pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-value-decription {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
  white-space: normal;
}

.indicator-icon-container {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.indicator-icon {
  height: 6mm;
  width: auto;
}
</style>
