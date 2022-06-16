<template>
  <div class="tk-camp-toolbar-container">
    <v-dialog v-model="generatePDF" hide-overlay>
      <template v-slot:activator="{ on: dialog, attrs }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              large
              color="accent"
              height="44"
              width="44"
              :disabled="!dataset.currentCamp"
              v-bind="attrs"
              v-on="{ ...tooltip, ...dialog }"
              @click="triggerExportToPDF()"
              :loading="generatePDF"
            >
              <v-icon dark>
                mdi-file-pdf-box
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("site.exportPreffix") }} PDF</span>
        </v-tooltip>
      </template>
      <TKSubmissionToPDF
        ref="tk-submission-to-pdf"
        @close-dialog="generatePDF = false"
      />
    </v-dialog>

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          color="accent"
          height="44"
          width="44"
          :disabled="!dataset.currentCamp"
          @click="exportToCSV()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-file-delimited-outline
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t("site.exportPreffix") }} CSV (UTF-8)</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import TKSubmissionToPDF from "./TKSubmissionToPDF/TKSubmissionToPDF.vue";
import { TKDatasetExportCurrentCampToCSV } from "@/domain/export/TKDatasetExportToCSV";
import { Component, Vue } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

@Component({
  components: {
    TKSubmissionToPDF
  }
})
export default class TKCampToolbarExportButton extends Vue {
  generatePDF = false;

  get dataset() {
    return TKDatasetModule.dataset;
  }

  exportToCSV() {
    if (TKDatasetModule.dataset && TKDatasetModule.dataset.currentSubmission) {
      TKDatasetExportCurrentCampToCSV(
        TKDatasetModule.dataset,
        this.$root.$i18n.locale
      );
    }
  }

  triggerExportToPDF() {
    this.$nextTick(function() {
      const exportToPDFComponent = this.$refs[
        "tk-submission-to-pdf"
      ] as TKSubmissionToPDF;
      if (exportToPDFComponent) {
        exportToPDFComponent.exportToPDF();
      }
    });
  }
}
</script>

<style scoped>
.tk-camp-toolbar-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: top;
}
</style>

<style>
.v-dialog {
  box-shadow: none !important;
}
</style>
