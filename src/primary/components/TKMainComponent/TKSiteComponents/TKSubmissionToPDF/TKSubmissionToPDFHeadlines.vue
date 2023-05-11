<template>
  <div class="headlines">
    <img src="@/assets/LogoOpsmap.png" class="header-logo" />
    <div class="headlines-left">
      <div class="headlines-title">{{ siteName }} - {{ date }}</div>

      <table>
        <tbody>
          <tr>
            <td class="headlines-infos-field">
              {{
                $t("infosSiteType")
                  .toString()
                  .toUpperCase()
              }}
            </td>
            <td class="headlines-infos-answer">
              {{ siteType.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{
                $t("infosAdmin1")
                  .toString()
                  .toUpperCase()
              }}
            </td>
            <td class="headlines-infos-answer">
              {{ admin1.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{
                $t("infosAdmin2")
                  .toString()
                  .toUpperCase()
              }}
            </td>
            <td class="headlines-infos-answer">
              {{ admin2.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr v-if="displaySiteInfos">
            <td class="headlines-infos-field">
              {{
                $t("site.infosCoordinates")
                  .toString()
                  .toUpperCase()
              }}
            </td>
            <td class="headlines-infos-answer">
              {{ coordinates.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{
                $t("manageBy")
                  .toString()
                  .toUpperCase()
              }}
            </td>
            <td class="headlines-infos-answer">
              {{ manageBy.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="headlines-spacer"></div>
    <img class="headlines-map-img" :src="mapImg" />
  </div>
</template>

<script lang="ts">
import { TKSurveyAnonymousType } from "@/domain/survey/TKSurvey";
import { IconPosition, TKIconUrl } from "@/domain/utils/TKIconUrl";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { toTitleCase } from "@/domain/utils/TKStringUtils";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { LngLat } from "mapbox-gl";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class TKSubmissionToPDFHeadlines extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  // Global infos
  siteName = "";
  date = "";

  // Site infos
  admin1 = "-";
  admin2 = "-";
  siteType = "-";
  coordinates = "-";
  manageBy = "";

  //Img src
  mapImg = "";

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    if (this.dataset && this.dataset.currentSite) {
      this.manageBy = TKGetLocalValue(
        this.dataset.currentSite
          ? this.dataset.currentSite?.managedBy
          : { en: "-" },
        this.$root.$i18n.locale
      );

      this.siteType = TKGetLocalValue(
        this.dataset.currentSite.type.thematicLabel,
        this.$root.$i18n.locale
      ).toUpperCase();
    }
  }

  @Watch("dataset.currentSite", { immediate: true })
  siteChanged() {
    if (this.dataset && this.dataset.currentSite) {
      this.siteName = toTitleCase(this.dataset.currentSite.name.toUpperCase());
      this.admin1 = this.dataset.currentSite.admin1.name;
      this.admin2 = this.dataset.currentSite.admin2.name;
      this.coordinates =
        this.dataset.currentSite.coordinates.lat +
        "," +
        this.dataset.currentSite.coordinates.lng;

      this.handleLocale();

      this.initMap();
    }
  }

  @Watch("dataset.currentSubmission", { immediate: true })
  dateChanged() {
    if (this.dataset.currentSubmission) {
      this.date = this.dataset.currentSubmission.date;
      this.handleLocale();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  initMap(): void {
    if (this.dataset && this.dataset.currentSite) {
      let staticMapUrl = "https://api.mapbox.com/";

      // Style
      staticMapUrl += "styles/v1/unhcr/ckok20x8h03ma18qp76mxi3u4/";

      // static
      staticMapUrl += "static/";

      // Marker
      // TODO: magic value : automate icon file name with SiteTypesValues
      let markerUrl = "";

      markerUrl = encodeURIComponent(
        TKIconUrl(
          this.dataset.currentSite.type.iconFileName.selected,
          IconPosition.MAP
        )
      );

      staticMapUrl += `url-${markerUrl}(${this.dataset.currentSite.coordinates.lng},${this.dataset.currentSite.coordinates.lat})/`;

      // Bounds
      const bounds = new LngLat(
        this.dataset.currentSite.coordinates.lng,
        this.dataset.currentSite.coordinates.lat
      )
        .toBounds(5000)
        .toArray();
      staticMapUrl += `[${bounds[0][0]},${bounds[0][1]},${bounds[1][0]},${bounds[1][1]}]/`;

      // Dimension
      staticMapUrl += "640x480@2x";

      // Token
      staticMapUrl += `?access_token=${TKConfigurationModule.configuration.spatialConfiguration.mapConfig.token}`;

      // Upadte img URL
      this.mapImg = staticMapUrl;
    }
  }

  get displaySiteInfos(): boolean {
    return (
      this.dataset.currentSurvey.options.anonymousMode ===
      TKSurveyAnonymousType.NONE
    );
  }
}
</script>

<style scoped>
/* HEADLINES *********************************************************/
.headlines {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  column-gap: 3mm;
}

.headlines-spacer {
  flex-grow: 2;
}
.headlines-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.headlines-infos {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}

.headlines-title {
  color: var(--v-accent-base);
  font-size: 18px;
  font-weight: bold;
  line-height: 1.467;
}

.headlines-map-img {
  width: 50mm;
  height: 33.3mm;
  border-radius: 15px;
  border: solid 1px var(--v-border-base);
  overflow: hidden;
}

.header-logo {
  text-decoration: none;
  height: 100%;
}

/* HEADLINES *********************************************************/

.headlines-infos-field {
  line-height: 2;
  font-size: 10px;
  font-weight: bold;
  color: var(--v-secondary-base);
  letter-spacing: 0.86;
  white-space: nowrap;
}

.headlines-infos-answer {
  text-align: right;
  white-space: nowrap;
  padding-left: 10px;
  line-height: 2;
  font-size: 10px;
  font-weight: bold;
  color: var(--v-accent-base);
  letter-spacing: 0.86px;
  min-width: 60 mm;
}

.headlines-infos-spacer {
  width: 99%;
}
</style>
