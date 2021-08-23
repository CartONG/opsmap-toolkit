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
import TKIndicatorStandard from "@/components/TKMainComponent/TKIndicators/TKIndicatorStandard.vue";
import TKIndicatorSiteOccupation from "@/components/TKMainComponent/TKIndicators/TKIndicatorSiteOccupation.vue";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKIndicatorType } from "@/domain/opsmapConfig/TKIndicatorsDescription";

@Component({
  components: {
    TKIndicatorStandard,
    TKIndicatorSiteOccupation
  }
})
export default class TKIndicatorComponent extends Vue {
  @Prop() readonly backgroundType!: number;
  @Prop() readonly indicator!: TKIndicator;
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
}
</script>

<style scoped>
.tk-indicator {
  position: relative;
  box-shadow: 0 0 20px 2px rgba(18, 63, 98, 0.15);
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  min-height: 100px;
  min-width: 300px;
  overflow: hidden;
}

.tk-indicator-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 129px;
  height: 63px;
}
</style>
