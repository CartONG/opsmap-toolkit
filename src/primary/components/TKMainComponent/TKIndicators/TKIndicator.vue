<template>
  <div class="tk-indicator">
    <img
      v-if="backgroundType === 1"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-1.png"
    />
    <img
      v-if="backgroundType === 2"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-2.png"
    />
    <img
      v-if="backgroundType === 3"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-3.png"
    />
    <TKIndicatorStandard v-if="!isSiteOccupation" :indicator="indicator" />
    <TKIndicatorSiteOccupation v-if="isSiteOccupation" :indicator="indicator" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TKIndicatorStandard from "@/primary/components/TKMainComponent/TKIndicators/TKIndicatorStandard.vue";
import TKIndicatorSiteOccupation from "@/primary/components/TKMainComponent/TKIndicators/TKIndicatorSiteOccupation.vue";
import {
  TKIndicator as TKIndicatorDefinition,
  TKIndicatorType
} from "@/domain/survey/TKIndicator";

@Component({
  components: {
    TKIndicatorStandard,
    TKIndicatorSiteOccupation
  }
})
export default class TKIndicator extends Vue {
  @Prop() readonly backgroundType!: number;
  @Prop() readonly indicator!: TKIndicatorDefinition;
  isSiteOccupation = false;

  @Watch("indicator", { immediate: true })
  handleIndicatorChange() {
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.indicator && this.indicator.type === TKIndicatorType.OCCUPATION) {
      this.isSiteOccupation = true;
    } else {
      this.isSiteOccupation = false;
    }
  }

  fontSize = 0;
  computeFont(): void {
    // FontSize: 35px ok --> 18 charactères pour 330px;
    // FontSize: 28px ok --> 23 charactères pour 330px;
    this.fontSize = 40;
  }
}
</script>

<style scoped>
.tk-indicator {
  position: relative;
  box-shadow: 0 3px 0px 0px var(--v-boxShadow-base);
  background-color: var(--v-background-base);
  border-color: transparent;
  border-radius: 4px;
  border: 1px solid var(--v-boxShadow-base);
  min-height: 100px;
  min-width: 300px;
  overflow: hidden;
}

.tk-indicator-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  max-width: 129px;
  max-height: 63px;
}
</style>
