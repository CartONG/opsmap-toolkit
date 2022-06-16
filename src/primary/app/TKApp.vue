<template>
  <v-app>
    <div v-if="showDemoBanner" class="tk-demo-banner">
      {{ $t("disclaimer.text") }}
    </div>
    <v-main>
      <div class="tk-main">
        <TKHeader />
        <TKMainComponent class="tk-main-dashboard" />
        <TKFooter />
      </div>
      <TKRouteHandler />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TKFooter, TKMainComponent, TKHeader } from "@/primary/components";
import { TKGetGeoBoundaries } from "@/domain/map/TKGetGeoBoundaries";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKRouteHandler from "@/primary/app/TKRouteHandler.vue";
import { TKSurveyExportToEsiteCSV } from "@/domain/export/TKSurveyExportToEsiteCSV";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKGeoDatasetModule from "@/store/modules/geodataset/TKGeoDatasetModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { TKCreateDataset } from "@/domain/survey/TKCreateDataset";

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent,
    TKRouteHandler
  }
})
export default class TKApp extends Vue {
  get showDemoBanner(): boolean {
    return TKConfigurationModule.configuration.options.showDemoBanner;
  }

  async mounted() {
    this.handeLocale();

    TKCreateDataset(
      TKConfigurationModule.configuration.surveys,
      TKConfigurationModule.configuration.spatial,
      TKConfigurationModule.configuration.indicators,
      TKConfigurationModule.configuration.languages
    ).then(dataset => {
      TKDatasetModule.setDataset(dataset);
      if (TKDatasetModule.dataset) {
        if (TKConfigurationModule.configuration.options.exportForEsite) {
          TKSurveyExportToEsiteCSV(
            TKDatasetModule.dataset.surveys[
              TKDatasetModule.dataset.surveys.length - 1
            ],
            this.$root.$i18n.locale,
            TKGetLocalValue(
              TKConfigurationModule.configuration.name,
              this.$root.$i18n.locale
            )
          );
        }

        TKGetGeoBoundaries(
          TKDatasetModule.dataset,
          TKConfigurationModule.configuration.spatial
        ).then(geoDataset => {
          TKGeoDatasetModule.setGeoDataset(geoDataset);
        });
      }
    });
  }

  @Watch("$root.$i18n.locale")
  handeLocale() {
    const name = TKGetLocalValue(
      TKConfigurationModule.configuration.name,
      this.$root.$i18n.locale
    );
    document.title =
      "Opsmap " + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport ((compatible IE9+)) */
  --padding-small: 5px;
  --padding-medium: 10px;
  --padding-large: 15px;
  --padding-logos: 30px;
  --side-padding: 10%;

  font-family: "Arial";
  font-size: 16px;
}

h3 {
  font-family: "Arial";
  font-size: 18px;
  letter-spacing: 1.5px;
}

.tk-loader {
  display: flex;
  min-height: 100%;
  min-width: 100%;
  justify-content: center;
  align-items: center;
}

.tk-demo-banner {
  z-index: 4096;
  position: sticky;
  top: 0;
  width: 100%;
  height: 35px;
  line-height: 35px;
  background-color: #3eb9bd;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  font-weight: bold;
  text-align: center;
}

.tk-main {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0px;
  height: 100%;
  width: 100%;
}

.tk-main-dashboard {
  flex-grow: 2;
}

.v-ripple__container {
  display: none !important;
}

.tk-autocomplete input {
  color: var(--v-autocomplete-base) !important;
  font-family: "Arial" !important;
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete input::placeholder {
  color: var(--v-autocomplete-base) !important;
  font-family: "Arial" !important;
  font-weight: bold !important;
  font-size: 16px !important;
  opacity: 0.5 !important;
}

.tk-autocomplete .v-text-field__prefix {
  color: rgba(118, 118, 118) !important;
  font-family: "Arial" !important;
  font-weight: bold !important;
  font-size: 16px !important;
  opacity: 0.5 !important;
}

.tk-autocomplete .theme--dark.v-icon,
.tk-autocomplete .theme--light.v-icon {
  color: var(--v-discrete-base) !important;
}

.tk-autocomplete .v-input__slot {
  border-color: var(--v-discrete-base) !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:before {
  border-color: var(--v-discrete-base) !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:after {
  border-color: var(--v-discrete-base) !important;
  transition: none !important;
}

.tk-autocomplete .theme--dark.v-icon.v-icon.v-icon,
.tk-autocomplete .theme--light.v-icon.v-icon.v-icon {
  color: var(--v-autocomplete-base) !important;
}

.tk-autocomplete .theme--dark.v-icon.v-icon.v-icon--disabled,
.tk-autocomplete .theme--light.v-icon.v-icon.v-icon--disabled {
  /* color: rgba(0, 0, 0, 0) !important; */
  opacity: 0.2 !important;
}

.theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before,
.theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
  -o-border-image: none !important;
  border-image: none !important;
}

.fade-enter-active,
.fade-in-enter-active {
  transition: opacity 300ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-leave-active,
.fade-in-leave-active {
  transition: opacity 225ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter,
.fade-leave-to,
.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}
.v-slider__thumb-label {
  transform: translateY(60%) translateY(30px) translateX(-50%) rotate(225deg) !important;
}
</style>
