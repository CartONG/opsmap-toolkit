<template>
  <div class="tk-camp-infos">
    <!-- Site Type -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosSiteType").toUpperCase() }}
        </div>
      </transition>

      <transition mode="out-in" name="fade-in">
        <div :key="siteType" class="tk-camp-infos-field-value">
          {{ siteType.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN1 -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosAdmin1").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin1" class="tk-camp-infos-field-value">
          {{ admin1.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN2 -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosAdmin2").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin2" class="tk-camp-infos-field-value">
          {{ admin2.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- GPS COORDINATES -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("site.infosCoordinates").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="coordinates" class="tk-camp-infos-field-value">
          {{ coordinates.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("manageBy").toUpperCase() }}
        </div>
      </transition>

      <transition mode="out-in" name="fade-in">
        <div :key="manageBy" class="tk-camp-infos-field-value">
          <div v-if="manageByUrl">
            <a
              :href="manageByUrl"
              target="_blank"
              class="tk-camp-infos-field-value"
            >
              {{ manageBy.toUpperCase() }}
            </a>
          </div>
          <div v-else>
            {{ manageBy.toUpperCase() }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { TKCampTypesValues } from "@/domain/survey/TKCamp";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKGetLocalValue, TKLabel } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampInfos extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  manageByLabel!: TKLabel;

  admin1 = "-";
  admin2 = "-";
  siteType = "-";
  coordinates = "-";
  manageBy = "";
  manageByUrl = "";

  @Watch("dataset.currentCamp", { immediate: true })
  onChange() {
    if (this.dataset) {
      this.admin1 = this.dataset.currentCamp
        ? this.dataset.currentCamp.infos.admin1.name
        : "-";
      this.admin2 = this.dataset.currentCamp
        ? this.dataset.currentCamp.infos.admin2.name
        : "-";

      this.coordinates = this.dataset.currentCamp
        ? this.dataset.currentCamp.infos.lat +
          "," +
          this.dataset.currentCamp.infos.lng
        : "-";
      this.handeLocale();
    }
  }

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChange() {
    this.manageByLabel = this.dataset.currentCamp
      ? this.dataset.currentCamp?.infos.managedBy
      : { en: "-" };

    if (this.dataset && this.dataset.currentSurvey) {
      this.manageByUrl = this.dataset.currentSurvey.fdf.urls[
        this.manageByLabel["en"]
      ];
    } else {
      this.manageByUrl = "";
    }

    this.handeLocale();
  }

  @Watch("$root.$i18n.locale")
  handeLocale() {
    if (!this.dataset || !this.dataset.currentCamp) {
      this.siteType = "-";
      this.manageBy = "-";
    } else {
      this.manageBy = TKGetLocalValue(
        this.manageByLabel,
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
}
</script>

<style scoped>
.tk-camp-infos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  width: 100%;
}

.tk-hseparator {
  height: 1px;
  width: 100%;
  background-color: #e0e0e0;
}

.tk-camp-infos-field {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}

.tk-camp-infos-field-key {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
}

.tk-camp-infos-field-value {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: #418fde;
  letter-spacing: 0.86px;
}
</style>
