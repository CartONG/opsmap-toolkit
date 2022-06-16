<template>
  <div class="tk-router-handler"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { headerLogoBus } from "@/primary/components/TKHeaderLogoBus";
import { Component, Watch } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

@Component
export default class TKRouteHandler extends Vue {
  currentRoute = "/";

  created() {
    headerLogoBus.$on("switchToHomePage", () => {
      if (this.$route.path !== "/") {
        if (TKDatasetModule.dataset) {
          TKDatasetModule.dataset.currentAdmin1 = null;
        }

        this.currentRoute = "/";
        this.$router.push({
          name: "home"
        });
      }
    });
  }

  get dataset() {
    return TKDatasetModule.dataset;
  }

  // Trigger at startup or when the changes comes from the URL
  @Watch("dataset")
  onDatasetChanged() {
    this.updateDatasetFromUrl();
  }

  // Triggered when a camp is selected
  @Watch("dataset.lastModification")
  onLastModificationChange() {
    this.updateUrlFromDataset();
  }

  @Watch("$route.path")
  onRouteChangedInTheNavbar() {
    if (
      this.currentRoute !== this.$route.path &&
      this.currentRoute !== this.$route.path + "/"
    ) {
      this.updateDatasetFromUrl();
      this.currentRoute = this.$route.path;
    }
  }

  // Adjust dataset from a given URL
  updateDatasetFromUrl() {
    if (this.$route.name === "home") {
      TKDatasetModule.dataset.currentAdmin1 = null;
    } else if (this.$route.name === "camp") {
      const survey: string = this.$route.params["survey"] ?? "";
      const admin1: string = this.$route.params["admin1"] ?? "";
      const admin2: string = this.$route.params["admin2"] ?? "";
      const camp: string = this.$route.params["camp"] ?? "";
      const date: string = this.$route.params["date"]?.replaceAll("-", "/");
      if (survey) {
        TKDatasetModule.dataset.setCurrentSurveyByName(survey);
        if (camp) {
          TKDatasetModule.dataset.setCurrentCampByName(camp);
          if (date) {
            TKDatasetModule.dataset.setSubmissionByDate(date);
          }
        } else if (admin2) {
          TKDatasetModule.dataset.setCurrentAdmin2ByName(admin2);
        } else if (admin1) {
          TKDatasetModule.dataset.setCurrentAdmin1ByName(admin1);
        }
      }
    }
  }

  // Adjust URL from a given dataset
  updateUrlFromDataset() {
    // upadte URL
    const surveyE = encodeURIComponent(
      TKDatasetModule.dataset.currentSurvey?.name ?? ""
    );
    const admin1E = encodeURIComponent(
      TKDatasetModule.dataset.currentAdmin1?.name ?? ""
    );
    const admin2E = encodeURIComponent(
      TKDatasetModule.dataset.currentAdmin2?.name ?? ""
    );
    const campE = encodeURIComponent(
      TKDatasetModule.dataset.currentCamp?.name ?? ""
    );
    const dateE = encodeURIComponent(
      TKDatasetModule.dataset.currentSubmission?.date.replaceAll("/", "-") ?? ""
    );

    let path = `/camp`;
    if (surveyE) {
      path += `/${surveyE}`;
      if (admin1E) {
        path += `/${admin1E}`;
        if (admin2E) {
          path += `/${admin2E}`;
          if (campE) {
            path += `/${campE}`;
            if (dateE) {
              path += `/${dateE}`;
            }
          }
        }
      } else {
        path = "/";
      }
    }
    if (
      this.$route.path !== path &&
      this.$route.path !== path + "/" &&
      !(!campE && this.$route.name === "home") // Prevent to camp page when no camp is selected
    ) {
      this.currentRoute = path;
      this.$router.push({
        path: path
      });
    }
  }
}
</script>

<style scoped>
.tk-router-handler {
  visibility: hidden;
}
</style>
