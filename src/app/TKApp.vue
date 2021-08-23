<template>
  <v-app>
    <v-main>
      <div class="tk-main" v-if="appRootConfig">
        <TKHeader :appConfig="appRootConfig" />
        <TKMainComponent
          class="tk-main-dashboard"
          :dataset="dataset"
          :geoData="geoDataset"
          :appConfig="appRootConfig"
          :isDatasetInitialized="isDatasetInitialized"
        />
        <TKFooter :appConfig="appRootConfig" />
      </div>
      <TKRouteHandler :dataset="dataset" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TKFooter, TKMainComponent, TKHeader } from "@/components";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKDatasetFitlererCreate } from "@/domain/survey/TKDatasetFitlererCreate";
import { TKGetGeoBoundaries } from "@/domain/map/TKGetGeoBoundaries";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import TKRouteHandler from "@/app/TKRouteHandler.vue";
import { TKOpsmapConfiguration } from "@/domain";

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent,
    TKRouteHandler
  }
})
export default class TKApp extends Vue {
  isDatasetInitialized = false;
  appRootConfig: TKOpsmapConfiguration = this.$root.$data.config;
  dataset: TKDatasetFilterer | null = null;
  geoDataset: TKGeoDataset | null = null;

  async mounted() {
    this.handeLocale();
    TKDatasetFitlererCreate(
      this.appRootConfig.surveys,
      this.appRootConfig.spatial,
      this.appRootConfig.indicators,
      this.appRootConfig.languages
    ).then(dataset => {
      this.dataset = dataset;
      this.isDatasetInitialized = true;
      TKGetGeoBoundaries(this.dataset, this.appRootConfig.spatial).then(
        geoDataset => {
          this.geoDataset = geoDataset;
        }
      );
    });
  }

  @Watch("$root.$i18n.locale")
  handeLocale() {
    const name = TKGetLocalValue(
      this.appRootConfig.name,
      this.$root.$i18n.locale
    );
    document.title =
      "Opsmap " + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
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
  color: #000 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete input::placeholder {
  color: #00000099 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete .v-text-field__prefix {
  color: rgba(118, 118, 118, 0.5);
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete .theme--light.v-icon {
  color: #d8d8d8 !important;
}

.tk-autocomplete .v-input__slot {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:before {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:after {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-autocomplete .theme--light.v-icon.v-icon.v-icon {
  color: #000 !important;
}

.tk-autocomplete .theme--light.v-icon.v-icon.v-icon--disabled {
  /* color: rgba(0, 0, 0, 0) !important; */
  opacity: 0.2 !important;
}

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
