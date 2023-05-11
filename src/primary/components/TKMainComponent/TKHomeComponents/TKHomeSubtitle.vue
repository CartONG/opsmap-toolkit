<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-home-subtitle">
      {{ $t("home.lastUpdate") }}: {{ lastUpdate }}
      <div v-if="isExportSelectionToCSV">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              large
              color="accent"
              height="30"
              width="30"
              @click="exportToCSV()"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-file-delimited-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("home.exportToCSV") }}</span>
        </v-tooltip>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKDatasetExportCurrentSelectionToCSV } from "@/domain/export/TKDatasetExportToCSV";
import { TKDateCompare } from "@/domain/utils/TKDate";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TKHomeSubtitle extends Vue {
  lastUpdate = "";

  get dataset() {
    return TKDatasetModule.dataset;
  }

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    if (TKDatasetModule.dataset) {
      let lastDate = "01/01/1970";
      for (const surveyIndex in TKDatasetModule.dataset.surveys) {
        const survey = TKDatasetModule.dataset.surveys[surveyIndex];
        for (const site of survey.sites) {
          const dateCandidate = site.submissions[0].date;
          if (TKDateCompare(lastDate, dateCandidate) > 0) {
            lastDate = dateCandidate;
          }
        }
      }
      this.lastUpdate = lastDate === "01/01/1970" ? "-" : lastDate;
    }
  }

  get isExportSelectionToCSV() {
    return TKConfigurationModule.configuration.options.exportAsCSVonHomePage;
  }
  exportToCSV() {
    TKDatasetExportCurrentSelectionToCSV(
      TKDatasetModule.dataset,
      this.$root.$i18n.locale
    );
  }
}
</script>

<style scoped>
.tk-home-subtitle {
  color: var(--v-secondary-base);
  font-size: 11px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
}
</style>
