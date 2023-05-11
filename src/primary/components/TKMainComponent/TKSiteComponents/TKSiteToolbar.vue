<template>
  <div class="tk-site-toolbar">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-site-toolbar-container">
        <v-autocomplete
          v-if="dataset.currentSite"
          key="1"
          class="tk-site-toolbar-item"
          background-color="backgroundSecondary"
          color="black"
          :disabled="dataset.currentSite.submissions.length < 2"
          flat
          filled
          solo
          dense
          height="44"
          v-model="dataset.currentSubmission"
          :items="dataset.currentSite.submissions"
          item-text="date"
          return-object
          :prefix="$t('site.datePreffix').toUpperCase()"
        ></v-autocomplete>
        <v-autocomplete
          v-else
          key="2"
          class="tk-site-toolbar-item-disabled"
          background-color="accent"
          color="background"
          disabled
          readonly
          flat
          filled
          solo
          dense
          height="44"
        ></v-autocomplete>
      </div>
    </transition>

    <TKSiteToolbarExportButton class="tk-site-toolbar-container" />
    <v-tooltip top>
      <template v-slot:activator="{ on: tooltip, attrs }">
        <v-btn-toggle rounded class="tk-site-toolbar-toggle">
          <v-btn
            icon
            height="44"
            width="44"
            :disabled="!dataset.currentSite"
            v-bind="attrs"
            v-on="tooltip"
            v-model="showVisualizerOptions"
            class="tk-site-toolbar-toggle-button"
          >
            <v-icon>
              mdi-tune-vertical-variant
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
      <span>Toggle toolbar </span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
// TODO: remove commented lines
import { Component, Vue } from "vue-property-decorator";
import TKSiteToolbarExportButton from "./TKSiteToolbarExportButton.vue";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";

@Component({
  components: {
    TKSiteToolbarExportButton
  }
})
export default class TKSiteToolbar extends Vue {
  get showVisualizerOptions() {
    return TKVisualizerOptionsModule.showVisualizerOptions;
  }

  set showVisualizerOptions(value: boolean) {
    TKVisualizerOptionsModule.setShowVisualizerOptions(value);
  }

  get dataset() {
    return TKDatasetModule.dataset;
  }
}
</script>

<style>
.tk-site-toolbar {
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  align-items: top;
  column-gap: 5px;
}

.tk-site-toolbar-item.theme--light.v-input input {
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-site-toolbar-item .theme--light.v-icon.v-icon.v-icon--disabled {
  opacity: 1 !important;
}

.tk-site-toolbar-item-disabled.v-input--is-disabled .v-input__slot {
  background-color: rgba(0, 0, 0, 0.12) !important;
}

.tk-site-toolbar .v-text-field__suffix,
.tk-site-toolbar .v-text-field__prefix {
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.tk-site-toolbar-toggle {
  height: 44px !important;
  width: 44px !important;
}

.tk-site-toolbar-toggle .v-btn--active:not(:hover) {
  color: transparent !important;
}

.tk-site-toolbar-toggle .v-btn > .v-btn__content > .v-icon {
  color: var(--v-notSelectedButton-base) !important;
}
.tk-site-toolbar-toggle .v-btn--active > .v-btn__content > .v-icon {
  color: var(--v-selectedButton-base) !important;
}

.tk-site-toolbar-toggle-button {
  height: 44px !important;
  width: 44px !important;
  min-width: 44px !important;
  border: none !important;
  padding: 0 !important;
}
</style>
