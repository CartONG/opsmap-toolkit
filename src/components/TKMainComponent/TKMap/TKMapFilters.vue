<template lang="html">
  <div class="tk-map-filters">
    <transition name="hide-filters">
      <div v-if="show" class="tk-map-filters-item">
        <div class="tk-map-filter">
          <img
            :class="
              campPlannedEnabled
                ? 'tk-indicator-icon'
                : 'tk-indicator-icon tk-indicator-icon-disabled'
            "
            :src="plannedImgUrl"
          />
          <transition mode="out-in" name="fade-in">
            <div
              :key="$root.$i18n.locale"
              :class="
                campPlannedEnabled
                  ? 'tk-map-filter-text'
                  : 'tk-map-filter-text tk-map-filter-text-disabled'
              "
            >
              {{ $t("map.legendPlanned") }}
            </div>
          </transition>
          <transition mode="out-in" name="fade-in">
            <div
              :key="countCampPlanned"
              :class="
                campPlannedEnabled
                  ? 'tk-map-filter-value'
                  : 'tk-map-filter-value tk-map-filter-value-disabled'
              "
            >
              {{ countCampPlanned }}
            </div>
          </transition>
          <v-checkbox
            v-model="checkboxs.planned"
            class="tk-map-filter-checkbox"
            @change="checkboxChange('planned')"
            :disabled="!campPlannedEnabled"
            hide-details
          ></v-checkbox>
        </div>
        <div class="tk-map-filter">
          <img
            :class="
              campSpontaneousEnabled
                ? 'tk-indicator-icon'
                : 'tk-indicator-icon tk-indicator-icon-disabled'
            "
            :src="spontaneousImgUrl"
          />
          <transition mode="out-in" name="fade-in">
            <div
              :key="$root.$i18n.locale"
              :class="
                campSpontaneousEnabled
                  ? 'tk-map-filter-text'
                  : 'tk-map-filter-text tk-map-filter-text-disabled'
              "
            >
              {{ $t("map.legendSpontaneous") }}
            </div>
          </transition>
          <transition mode="out-in" name="fade-in">
            <div
              :key="countCampSpontaneous"
              :class="
                campSpontaneousEnabled
                  ? 'tk-map-filter-value'
                  : 'tk-map-filter-value tk-map-filter-value-disabled'
              "
            >
              {{ countCampSpontaneous }}
            </div>
          </transition>
          <v-checkbox
            v-model="checkboxs.spontaneous"
            @change="checkboxChange('spontaneous')"
            class="tk-map-filter-checkbox"
            :disabled="!campSpontaneousEnabled"
            hide-details
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
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  TKDatasetFilterer,
  TKFilters
} from "@/domain/survey/TKDatasetFilterer";
import { TKCampTypesValues } from "@/domain/survey/TKCamp";

@Component
export default class TKMapFilter extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  plannedImgUrl = TKIconUrl("planned_site");
  spontaneousImgUrl = TKIconUrl("spontaneous_site");
  show = true;
  checkboxs = {
    planned: true,
    spontaneous: true
  };
  countCampPlanned = 0;
  countCampSpontaneous = 0;

  campPlannedEnabled = true;
  campSpontaneousEnabled = true;

  checkboxChange(checkbox: string): void {
    checkbox === "planned"
      ? this.dataset.setFiltersValue(
          TKFilters.PLANNED_SITE,
          this.checkboxs.planned
        )
      : this.dataset.setFiltersValue(
          TKFilters.SPONTANEOUS_SITE,
          this.checkboxs.spontaneous
        );
  }

  @Watch("dataset.filteredCampsList", { immediate: true })
  datasetChanged() {
    this.countCampPlanned = this.dataset?.filteredCampsList.filter(
      camp => camp.infos.type === TKCampTypesValues.PLANNED
    ).length;

    this.campPlannedEnabled =
      !this.checkboxs.planned || this.countCampPlanned > 0;
    this.countCampSpontaneous = this.dataset?.filteredCampsList.filter(
      camp => camp.infos.type === TKCampTypesValues.SPONTANEOUS
    ).length;
    this.campSpontaneousEnabled =
      !this.checkboxs.spontaneous || this.countCampSpontaneous > 0;
  }
}
</script>
<style scoped>
.tk-map-filters {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #f1f3f3;
  background-color: #ffffff;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  row-gap: 10px;
  height: 75px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}

.tk-map-filters-item {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  row-gap: 10px;
  flex-grow: 1;
  max-width: 300px;
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
}

.tk-map-filter-text-disabled,
.tk-map-filter-value-disabled {
  color: #bdbdbd;
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
  background-color: #f1f3f3;
  width: 1px;
  height: 100%;
  margin-left: -1px;
}
</style>
