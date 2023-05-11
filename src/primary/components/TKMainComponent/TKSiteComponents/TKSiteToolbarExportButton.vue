<template>
  <div class="tk-site-toolbar-container">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="!dataset.currentSite"
          icon
          large
          color="selectedButton"
          height="44"
          width="44"
          v-bind="attrs"
          v-on="on"
          :loading="generating"
        >
          <v-icon>
            mdi-file-export-outline
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-dialog v-model="generating" hide-overlay>
          <template v-slot:activator="{ on: dialog, attrs }">
            <v-list-item
              @click="triggerExportToPDF()"
              v-bind="attrs"
              v-on="{ ...dialog }"
            >
              <v-list-item-icon>
                <v-icon color="accent">{{ "$vuetify.icons.filePDF" }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  >{{ $t("site.exportPreffix") }} PDF</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </template>
          <TKSubmissionToPDF
            ref="tk-submission-to-pdf"
            @close-dialog="generating = false"
          />
        </v-dialog>
        <v-list-item @click="exportToCSV()">
          <v-list-item-icon>
            <v-icon color="accent">{{ "$vuetify.icons.fileCSV" }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              >{{ $t("site.exportPreffix") }} CSV</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import TKSubmissionToPDF from "./TKSubmissionToPDF/TKSubmissionToPDF.vue";
import { TKDatasetExportCurrentSiteToCSV } from "@/domain/export/TKDatasetExportToCSV";
import { Component, Vue } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

@Component({
  components: {
    TKSubmissionToPDF
  }
})
export default class TKSiteToolbarExportButton extends Vue {
  generating = false;

  get dataset() {
    return TKDatasetModule.dataset;
  }

  exportToCSV() {
    this.generating = true;
    if (TKDatasetModule.dataset && TKDatasetModule.dataset.currentSubmission) {
      TKDatasetExportCurrentSiteToCSV(
        TKDatasetModule.dataset,
        this.$root.$i18n.locale
      );
    }
    this.generating = false;
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
.tk-site-toolbar-container {
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
