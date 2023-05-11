<template lang="html">
  <div class="tk-map-filters" ref="tk-map-filters">
    <transition name="hide-filters">
      <div v-if="show" class="tk-map-filters-item">
        <div v-for="(site, key) in sites" :key="key" class="tk-map-filter">
          <img
            :class="
              site.enabled
                ? 'tk-indicator-icon'
                : 'tk-indicator-icon tk-indicator-icon-disabled'
            "
            :src="site.iconUrl"
          />
          <transition mode="out-in" name="fade-in">
            <div
              :key="$root.$i18n.locale"
              :class="
                site.enabled
                  ? 'tk-map-filter-text'
                  : 'tk-map-filter-text tk-map-filter-text-disabled'
              "
            >
              {{ text(site.title) }}
            </div>
          </transition>
          <transition mode="out-in" name="fade-in">
            <div
              :key="site.count"
              :class="
                site.enabled
                  ? 'tk-map-filter-value'
                  : 'tk-map-filter-value tk-map-filter-value-disabled'
              "
            >
              {{ site.count }}
            </div>
          </transition>
          <v-checkbox
            v-model="site.active"
            class="tk-map-filter-checkbox"
            hide-details
            :disabled="!site.enabled"
            @change="checkboxChange(site.type, site.active)"
          ></v-checkbox>
        </div>
      </div>
    </transition>
    <div class="tk-vseparator" />
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          color="primary"
          @click="show = !show"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-map-legend</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("map.legendFilters") }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import { Component, Vue, Watch } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";

@Component
export default class TKMapFilter extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  sites: Array<{
    type: string;
    title: TKLabel;
    iconUrl: string;
    active: boolean;
    enabled: boolean;
    count: number;
  }> = [];

  mounted() {
    this.updateSites();
  }

  checkboxChange(type: string, active: boolean): void {
    this.dataset.setTypedFilterValue(type, active);
  }

  @Watch("dataset.currentSurvey", { immediate: true })
  updateSites() {
    this.sites = [];
    if (this.dataset && this.dataset.currentSurvey) {
      for (const siteKeys of Object.keys(
        this.dataset.currentSurvey.fdf.siteTypes
      )) {
        const site = this.dataset.currentSurvey.fdf.siteTypes[siteKeys];
        this.sites.push({
          type: site.formattedName,
          title: site.thematicLabel,
          iconUrl: TKIconUrl(site.iconFileName.normal),
          active: true,
          enabled: true,
          count: 0
        });
      }
      this.updateCount();
    }
    if (this.$refs["tk-map-filters"]) {
      (this.$refs["tk-map-filters"] as HTMLBaseElement).style.height = `${this
        .sites.length * 34}px`;
    }
  }

  text(label: TKLabel): string {
    return TKGetLocalValue(label, this.$root.$i18n.locale);
  }

  show = true;

  @Watch("dataset.filteredSitesList", { immediate: true })
  updateCount() {
    for (let idx = 0; idx < this.sites.length; idx++) {
      this.sites[idx].count = this.dataset.filteredSitesList.filter(
        site => site.type.formattedName === this.sites[idx].type
      ).length;
    }
  }
}
</script>
<style scoped>
.tk-map-filters {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--v-border-base);
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  row-gap: 10px;
}

.tk-map-filters-item {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  row-gap: 10px;
  flex-grow: 1;
  opacity: 1;
  overflow: hidden;
}

.hide-filters-enter-active,
.hide-filters-leave-active {
  transition: all 0.5s ease;
}
.hide-filters-enter,
.hide-filters-leave-to {
  max-width: 0px;
  opacity: 0;
}

.tk-map-filter {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
}

.tk-map-filter-text {
  flex-grow: 1;
  font-size: 13px;
  white-space: nowrap;
}

.tk-map-filter-text-disabled,
.tk-map-filter-value-disabled {
  color: var(--v-disabled-base);
}

.tk-map-filter-checkbox {
  padding: 0px;
  margin: auto;
}

.tk-indicator-icon {
  display: block;
  width: 20px;
  height: 20px;
  margin-left: 5px;
}

.tk-indicator-icon-disabled {
  filter: grayscale(1);
}

.tk-vseparator {
  background-color: var(--v-border-base);
  width: 1px;
  height: 100%;
  margin-left: -1px;
}
</style>
