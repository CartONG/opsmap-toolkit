<template>
  <div class="tk-indicator-container">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div class="tk-indicator-subcontainer mt-5" v-bind="attrs" v-on="on">
          <v-progress-linear
            :value="value"
            height="30"
            rounded
            stream
            :color="siteOccupationColor"
            readonly
          >
            <strong>{{ labelCenterOfProgress }}</strong>
          </v-progress-linear>
          <transition mode="out-in" name="fade-in">
            <div
              :key="$root.$i18n.locale"
              class="tk-indicator-value-decription"
            >
              <span>{{ name }} : </span>
              <span class="uppercase--text">{{ labelYesNo }}</span>
            </div>
          </transition>
        </div>
      </template>
      <span>{{ name }} : {{ labelValue }} </span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKIndicatorType } from "@/domain/opsmapConfig/TKIndicatorsDescription";

@Component
export default class TKIndicatorSiteOccupation extends Vue {
  @Prop() readonly indicator!: TKIndicator;
  value = -1;
  name = "";
  labelCenterOfProgress = "-";
  labelValue = "";
  labelYesNo = "";

  @Watch("indicator", { immediate: true })
  handleIndicatorChange() {
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.indicator && this.indicator.type === TKIndicatorType.OCCUPATION) {
      this.name = TKGetLocalValue(
        this.indicator.nameLabel,
        this.$root.$i18n.locale
      );
      this.labelValue = TKGetLocalValue(
        this.indicator.valueLabel,
        this.$root.$i18n.locale
      );

      this.labelYesNo = TKGetLocalValue(
        this.indicator.valueYesNoLabel,
        this.$root.$i18n.locale
      );

      this.value = this.indicator.valueNumber;
      if (this.value > -1) {
        this.labelCenterOfProgress = `${this.value}%`;
      } else {
        this.labelCenterOfProgress = "";
        this.labelYesNo = "-";
      }
    } else {
      this.value = 0;
      this.name = "-";
      this.labelYesNo = "-";
      this.labelCenterOfProgress = "-";
    }
  }
  get siteOccupationColor() {
    if (this.value === undefined || this.value < 0) return "#E0E0E0";
    if (this.value < 80) return "green";
    if (this.value < 90) return "yellow";
    if (this.value < 100) return "orange";
    return "#e91d1d";
  }
}
</script>

<style scoped>
.tk-indicator-container {
  display: flex;
  width: 100%;
}

.tk-indicator-subcontainer {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 36px;
  align-items: left;
  width: 100%;
}
.tk-indicator-value-decription {
  color: var(--v-quaternary-base);
  font-weight: bolder;
  font-size: 16px;
  line-height: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
