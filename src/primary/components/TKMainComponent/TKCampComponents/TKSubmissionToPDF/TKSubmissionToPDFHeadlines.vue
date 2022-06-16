<template>
  <div class="headlines">
    <img src="@/assets/LogoOpsmap.png" class="header-logo" />
    <div class="headlines-left">
      <div class="headlines-title">{{ siteName }} - {{ date }}</div>

      <table>
        <tbody>
          <tr>
            <td class="headlines-infos-field">
              {{ $t("infosSiteType").toUpperCase() }}
            </td>
            <td class="headlines-infos-answer">
              {{ siteType.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{ $t("infosAdmin1").toUpperCase() }}
            </td>
            <td class="headlines-infos-answer">
              {{ admin1.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{ $t("infosAdmin2").toUpperCase() }}
            </td>
            <td class="headlines-infos-answer">
              {{ admin2.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{ $t("site.infosCoordinates").toUpperCase() }}
            </td>
            <td class="headlines-infos-answer">
              {{ coordinates.toUpperCase() }}
            </td>
            <td class="headlines-infos-spacer"></td>
          </tr>
          <tr>
            <td class="headlines-infos-field">
              {{ $t("manageBy").toUpperCase() }}
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
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
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

  // Camp infos
  admin1 = "-";
  admin2 = "-";
  siteType = "-";
  coordinates = "-";
  manageBy = "";

  //Img src
  mapImg = "";

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    if (this.dataset && this.dataset.currentCamp) {
      this.manageBy = TKGetLocalValue(
        this.dataset.currentCamp
          ? this.dataset.currentCamp?.managedBy
          : { en: "-" },
        this.$root.$i18n.locale
      );

      this.siteType = TKGetLocalValue(
        this.dataset.currentCamp.type.thematicLabel,
        this.$root.$i18n.locale
      ).toUpperCase();
    }
  }

  @Watch("dataset.currentCamp", { immediate: true })
  campChanged() {
    if (this.dataset && this.dataset.currentCamp) {
      this.siteName = toTitleCase(this.dataset.currentCamp.name.toUpperCase());
      this.admin1 = this.dataset.currentCamp.admin1.name;
      this.admin2 = this.dataset.currentCamp.admin2.name;
      this.coordinates =
        this.dataset.currentCamp.lat + "," + this.dataset.currentCamp.lng;

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
    if (this.dataset && this.dataset.currentCamp) {
      let staticMapUrl = "https://api.mapbox.com/";

      // Style
      staticMapUrl += "styles/v1/unhcr/ckok20x8h03ma18qp76mxi3u4/";

      // static
      staticMapUrl += "static/";

      // Marker
      // TODO: magic value : automate icon file name with CampTypesValues
      let markerUrl = "";

      markerUrl = encodeURIComponent(
        TKIconUrl(this.dataset.currentCamp.type.iconFileName.selected)
      );

      staticMapUrl += `url-${markerUrl}(${this.dataset.currentCamp.lng},${this.dataset.currentCamp.lat})/`;

      // Bounds
      const bounds = new LngLat(
        this.dataset.currentCamp.lng,
        this.dataset.currentCamp.lat
      )
        .toBounds(5000)
        .toArray();
      staticMapUrl += `[${bounds[0][0]},${bounds[0][1]},${bounds[1][0]},${bounds[1][1]}]/`;

      // Dimension
      staticMapUrl += "640x480@2x";

      // Token
      staticMapUrl += `?access_token=${TKConfigurationModule.configuration.mapConfig.token}`;

      // Upadte img URL
      this.mapImg = staticMapUrl;
    }
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
  background-color: coral;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}

.headlines-title {
  color: #333333;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.467;
}

.headlines-map-img {
  width: 50mm;
  height: 33.3mm;
  border-radius: 15px;
  border: solid 1px #999;
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
  color: #999;
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
  color: #418fde;
  letter-spacing: 0.86px;
  min-width: 60 mm;
}

.headlines-infos-spacer {
  width: 99%;
}
</style>
