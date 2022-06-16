<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-submissionvisualizer-toolbar">
      <v-text-field
        class="search-field"
        :label="$t('site.filter')"
        solo
        dense
        flat
        single-line
        hide-details
        clearable
        v-model="search"
        @keydown.enter="setSearchImmediate"
        prepend-inner-icon="mdi-magnify"
        height="44"
      ></v-text-field>
      <v-btn-toggle class="tk-submissionvisualizer-toggle">
        <v-btn
          class="toggle-button"
          v-model="hideUnanswered"
          color="#919191"
          plain
        >
          <v-icon left>mdi-file-sign</v-icon
          >{{ $t("site.hideUnanswered") }}</v-btn
        >
      </v-btn-toggle>
      <v-btn-toggle class="tk-submissionvisualizer-toggle">
        <v-btn
          class="toggle-button"
          v-model="sortByTrafficLight"
          color="#919191"
          plain
        >
          <v-icon left>mdi-traffic-light-outline</v-icon
          >{{ $t("site.sortByTrafficLight") }}
        </v-btn>
      </v-btn-toggle>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
@Component({
  components: {}
})
export default class TKSubmissionVisualizerToolbar extends Vue {
  // search
  timeOutID = 0;
  _search = "";

  get search(): string {
    return TKVisualizerOptionsModule.searchFilter;
  }

  set search(search: string) {
    this._search = search;
    window.clearTimeout(this.timeOutID);
    if (search) {
      // text is typed
      this.timeOutID = window.setTimeout(() => {
        this.triggerSearch();
      }, 1000);
    } else {
      // test is cleared
      this.triggerSearch();
    }
  }

  setSearchImmediate() {
    window.clearTimeout(this.timeOutID);
    this.triggerSearch();
  }

  triggerSearch() {
    TKVisualizerOptionsModule.setSearchFilter(this._search);
  }

  get hideUnanswered() {
    return TKVisualizerOptionsModule.hideUnanswered;
  }

  set hideUnanswered(value: boolean) {
    TKVisualizerOptionsModule.setHideUnanswered(value);
  }

  get sortByTrafficLight() {
    return TKVisualizerOptionsModule.sortByTrafficLigh;
  }

  set sortByTrafficLight(value: boolean) {
    TKVisualizerOptionsModule.setSortByTrafficLight(value);
  }
}
</script>

<style>
.tk-submissionvisualizer-toggle .v-btn--active > .v-btn__content {
  color: var(--v-accent-base) !important;
}
</style>

<style scoped>
.search-field {
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid var(--v-thematicBorder-base);
  width: 100%;
  background-color: var(--v-thematicBackground-base);
  overflow: hidden;
}
.tk-submissionvisualizer-toolbar {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  column-gap: 20px;
}

.toggle-button {
  border: none !important;
}
</style>
