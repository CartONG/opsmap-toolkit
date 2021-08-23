<template>
  <div class="headlines">
    <div class="headlines-left">
      <div class="headlines-title">{{ siteName }}</div>
      <div class="headlines-subtitle">{{ date }}</div>
      <div class="headlines-infos">
        <!-- Site Type -->
        <div class="tk-camp-infos-field">
          <div class="tk-camp-infos-field-key">
            {{ $t("infosSiteType").toUpperCase() }}
          </div>
          <div class="tk-camp-infos-field-value">
            {{ siteType.toUpperCase() }}
          </div>
        </div>
        <!-- ADMIN1 -->
        <div class="tk-camp-infos-field">
          <div class="tk-camp-infos-field-key">
            {{ $t("infosAdmin1").toUpperCase() }}
          </div>
          <div class="tk-camp-infos-field-value">
            {{ admin1.toUpperCase() }}
          </div>
        </div>
        <!-- ADMIN2 -->
        <div class="tk-camp-infos-field">
          <div class="tk-camp-infos-field-key">
            {{ $t("infosAdmin2").toUpperCase() }}
          </div>
          <div class="tk-camp-infos-field-value">
            {{ admin2.toUpperCase() }}
          </div>
        </div>
        <!-- GPS COORDINATES -->
        <div class="tk-camp-infos-field">
          <div class="tk-camp-infos-field-key">
            {{ $t("site.infosCoordinates").toUpperCase() }}
          </div>
          <div class="tk-camp-infos-field-value">
            {{ coordinates.toUpperCase() }}
          </div>
        </div>
        <!-- MANAGE BY -->
        <div class="tk-camp-infos-field">
          <div class="tk-camp-infos-field-key">
            {{ $t("manageBy").toUpperCase() }}
          </div>
          <div class="tk-camp-infos-field-value">
            {{ manageBy.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
    <img class="headlines-map-img" :src="mapImg" />
  </div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKCampTypesValues } from "@/domain/survey/TKCamp";

import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { toTitleCase } from "@/domain/ui/TKStringUtils";
import { LngLat } from "mapbox-gl";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class TKSubmissionToPDFHeadlines extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
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
          ? this.dataset.currentCamp?.infos.managedBy
          : { en: "-" },
        this.$root.$i18n.locale
      );

      if (this.dataset.currentCamp.infos.type === TKCampTypesValues.PLANNED) {
        this.siteType = this.$root.$i18n
          .t("infosSitePlanned")
          .toString()
          .toUpperCase();
      } else {
        this.siteType = this.$root.$i18n
          .t("infosSiteSpontanneous")
          .toString()
          .toUpperCase();
      }
    }
  }

  @Watch("dataset.currentCamp", { immediate: true })
  campChanged() {
    if (this.appConfig && this.dataset && this.dataset.currentCamp) {
      this.siteName = toTitleCase(
        this.dataset.currentCamp.infos.name.toUpperCase()
      );
      this.admin1 = this.dataset.currentCamp.infos.admin1.name;
      this.admin2 = this.dataset.currentCamp.infos.admin2.name;
      this.coordinates =
        this.dataset.currentCamp.infos.lat +
        "," +
        this.dataset.currentCamp.infos.lng;

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
      if (this.dataset.currentCamp.infos.type === TKCampTypesValues.PLANNED) {
        markerUrl = encodeURIComponent(TKIconUrl("planned_site_selected"));
      } else {
        markerUrl = encodeURIComponent(TKIconUrl("spontaneous_site_selected"));
      }
      staticMapUrl += `url-${markerUrl}(${this.dataset.currentCamp.infos.lng},${this.dataset.currentCamp.infos.lat})/`;

      // Bounds
      const bounds = new LngLat(
        this.dataset.currentCamp.infos.lng,
        this.dataset.currentCamp.infos.lat
      )
        .toBounds(5000)
        .toArray();
      staticMapUrl += `[${bounds[0][0]},${bounds[0][1]},${bounds[1][0]},${bounds[1][1]}]/`;

      // Dimension
      staticMapUrl += "640x480@2x";

      // Token
      staticMapUrl += `?access_token=${this.appConfig.mapConfig.token}`;

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
  height: 48mm;
}

.headlines-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  flex-grow: 2;
}

.headlines-title {
  color: #333333;
  font-size: 23px;
  font-weight: bold;
  line-height: 1.467;
}
.headlines-subtitle {
  color: #333333;
  font-size: 20px;
  font-weight: lighter;
  line-height: 1.467;
}

.headlines-map-img {
  width: 64mm;
  height: 48mm;
  border-radius: 15px;
  border: solid 1px #999;
  overflow: hidden;
}

/* HEADLINES *********************************************************/
.headlines-hseparator {
  width: 100%;
  border: 0;
  height: 0;
  border-top: 1px solid #99999922;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.headlines-infos {
  max-width: 100mm;
}

.tk-camp-infos-field {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}

.tk-camp-infos-field-key {
  line-height: 2;
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
}

.tk-camp-infos-field-value {
  line-height: 2;
  font-size: 12px;
  font-weight: bold;
  color: #418fde;
  letter-spacing: 0.86px;
}
</style>
