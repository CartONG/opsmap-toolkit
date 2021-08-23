<template>
  <div class="tk-maincomponent">
    <div class="tk-maincomponent-decoration">
      <div class="tk-maincomponent-blur"></div>
      <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png" />
    </div>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <transition name="fade">
          <router-view
            name="header"
            v-if="isDatasetInitialized"
            :dataset="dataset"
          ></router-view>
        </transition>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle :appConfig="appConfig" />
          <transition mode="out-in" name="fade">
            <TKPlaceHolderLeft v-if="!isDatasetInitialized" />
            <router-view
              v-else
              name="left"
              :appConfig="appConfig"
              :dataset="dataset"
              :visualizerOptions="visualizerOptions"
              :pdfInfos="pdfInfos"
            ></router-view>
          </transition>
        </div>
        <TKMap
          v-if="geoData"
          class="tk-main-map"
          :appConfig="appConfig"
          :dataset="dataset"
          :geoDataset="geoData"
        />
        <TKPlaceHolderGeneric class="tk-main-map" v-else />
      </div>

      <div class="tk-main-content-layout">
        <transition mode="out-in" name="fade">
          <div class="tk-main-content-layout" v-if="!isDatasetInitialized">
            <TKPlaceHolderIndicators />
            <TKPlaceHolderGeneric class="tk-main-content-placeholder" />
          </div>
          <router-view
            name="indicators"
            v-else
            :visualizerOptions="visualizerOptions"
            :appConfig="appConfig"
            :dataset="dataset"
          ></router-view>
        </transition>
        <transition mode="out-in" name="fade" appear>
          <router-view
            name="content"
            v-if="isDatasetInitialized"
            :visualizerOptions="visualizerOptions"
            :appConfig="appConfig"
            :dataset="dataset"
            :pdfInfos="pdfInfos"
          ></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TKPlaceHolderLeft from "./TKPlaceHolders/TKPlaceHolderLeft.vue";
import TKPlaceHolderIndicators from "./TKPlaceHolders/TKPlaceHolderIndicators.vue";
import TKPlaceHolderGeneric from "./TKPlaceHolders/TKPlaceHolderGeneric.vue";
import TKTitle from "./TKTitle.vue";
import TKMap from "./TKMap";

import { TKHomeIndicators, TKHomeMoreInfos } from "./TKHomeComponents";

import {
  TKCampIndicators,
  TKCampInfos,
  TKCampSelector,
  TKCampToolbar,
  TKCampSubtitle,
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
import { TKOpsmapConfiguration } from "@/domain";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";

const DEFAULT_VISUALIZER_OPTIONS: TKSubmissionVisualizerOptions = {
  hideUnanswered: false
};

@Component({
  components: {
    TKCampIndicators,
    TKCampInfos,
    TKCampSelector,
    TKCampSubtitle,
    TKCampToolbar,
    TKSubmissionVisualizer,
    TKHomeIndicators,
    TKHomeMoreInfos,
    TKMap,
    TKPlaceHolderLeft,
    TKPlaceHolderIndicators,
    TKPlaceHolderGeneric,
    TKTitle
  }
})
export default class TKMainComponent extends Vue {
  @Prop()
  readonly isDatasetInitialized = false;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly geoData!: TKGeoDataset;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  readonly pdfInfos: TKPDFInfos = {
    currentChartsBase64: {},
    pdfColumnCount: this.appConfig.options.pdfColumnCount
  };

  visualizerOptions: TKSubmissionVisualizerOptions = {
    hideUnanswered: DEFAULT_VISUALIZER_OPTIONS.hideUnanswered
  };

  // Trigger when a camp is selected
  @Watch("dataset.lastModification")
  onLastModificationChange() {
    this.visualizerOptions.hideUnanswered =
      DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;
  }
}
</script>

<style scoped>
.tk-maincomponent-decoration {
  position: absolute;
  width: 100%;
  height: 365px;
}

.tk-maincomponent-blur {
  position: absolute;
  width: 100%;
  height: 365px;
  opacity: 0.21;
  background: linear-gradient(#3a9ed3ff, #3a9ed300);
}

.tk-maincomponent-png {
  position: absolute;
  width: 100%;
  min-width: 1732px;
  height: 365px;
  background-size: 100% 365px;
}

.tk-maincomponent-container {
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  height: 100%;
}

.tk-main-header {
  display: block;
  z-index: 1;
  min-height: 64px;
  align-items: flex-end;
  height: 100%;
  margin-left: -20px;
  margin-right: -20px;
}

.tk-main-top {
  display: flex;
  flex-flow: row wrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
  row-gap: 10px;
}

.tk-main-left {
  width: 30%;
  padding-bottom: 20px;
  padding-top: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  min-width: 350px;
}

.tk-main-map {
  width: 65%;
  min-width: 300px;
  height: 450px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.tk-main-content-layout {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}

.tk-main-content-placeholder {
  min-height: 300px;
}
</style>
