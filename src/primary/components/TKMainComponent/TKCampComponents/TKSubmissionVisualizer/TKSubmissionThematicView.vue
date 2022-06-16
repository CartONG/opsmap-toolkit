<template lang="html">
  <div class="tk-submission-thematic-container">
    <div class="tk-submission-thematic-header">
      <transition mode="out-in" name="fade-in">
        <div :key="title" class="tk-submission-thematic-title">{{ title }}</div>
      </transition>
      <img class="tk-submission-icon" :src="iconurl" />
    </div>
    <div class="tk-submission-thematic-content">
      <div
        v-for="(entry, key) in thematicData"
        :key="key"
        v-show="!hideUnanswered || (hideUnanswered && entry.isAnswered)"
      >
        <TKSubmissionEntryView :entry="entry" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import TKSubmissionEntryView from "./TKSubmissionEntryView.vue";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import {
  TKSubmissionEntry,
  TKSubmissionEntryType
} from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";

@Component({
  components: {
    TKSubmissionEntryView
  }
})
export default class TKSubmissionThematicView extends Vue {
  @Prop()
  readonly submissionThematic!: TKSubmissionThematic;

  get hideUnanswered() {
    return TKVisualizerOptionsModule.hideUnanswered;
  }

  get searchFilter() {
    return TKVisualizerOptionsModule.searchFilter;
  }

  get sortByTrafficLight() {
    return TKVisualizerOptionsModule.sortByTrafficLigh;
  }

  thematicData: Array<TKSubmissionEntry> = [];

  title = "";
  iconurl = "";
  @Watch("submissionThematic", { immediate: true })
  onSubmissionThematicchanged() {
    if (this.submissionThematic) {
      this.handleLocaleOnTitle();
      this.iconurl = TKIconUrl(this.submissionThematic.iconFileName);
    } else {
      this.iconurl = "";
    }
    this.updateThematcData();
  }

  @Watch("$root.$i18n.locale")
  handleLocaleOnTitle() {
    if (this.submissionThematic) {
      this.title = TKGetLocalValue(
        this.submissionThematic.nameLabel,
        this.$root.$i18n.locale
      );
    } else {
      this.title = "";
    }
  }

  getRankValue(entry: TKSubmissionEntry): number {
    // rank:
    //       CRITICAL = 0
    //       DANGER = 1
    //       WARNING = 2
    //       OK = 3
    //       UNDEFINED = 4
    //       NOTL = 5
    if (entry.type === TKSubmissionEntryType.TEXT) {
      if (entry.trafficLight) {
        switch (entry.trafficLightColor) {
          case TKTrafficLightValues.CRITICAL:
            return 0;
          case TKTrafficLightValues.DANGER:
            return 1;
          case TKTrafficLightValues.WARNING:
            return 2;
          case TKTrafficLightValues.OK:
            return 3;
          case TKTrafficLightValues.UNDEFINED:
            return 4;
        }
      }
    }

    return 5;
  }

  @Watch("hideUnanswered", { immediate: true })
  @Watch("sortByTrafficLight", { immediate: true })
  @Watch("searchFilter", { immediate: true })
  updateThematcData() {
    if (this.submissionThematic) {
      if (this.sortByTrafficLight) {
        this.thematicData = [...this.submissionThematic.data].sort(
          (a: TKSubmissionEntry, b: TKSubmissionEntry): number => {
            const rankA = this.getRankValue(a);
            const rankB = this.getRankValue(b);
            if (rankA < rankB) {
              return -1;
            }
            if (rankA === rankB) {
              return 0;
            }
            return 1;
          }
        );
      } else {
        this.thematicData = this.submissionThematic.data;
      }
    } else {
      this.thematicData = [];
    }

    if (this.searchFilter) {
      this.thematicData = this.thematicData.filter(
        (item: TKSubmissionEntry) => {
          if (item.type !== TKSubmissionEntryType.TEXT) {
            return true;
          }
          for (const value of Object.values(item.answerLabel)) {
            if (value.toLowerCase().includes(this.searchFilter.toLowerCase())) {
              return true;
            }
          }
          for (const value of Object.values(item.fieldLabel)) {
            if (value.toLowerCase().includes(this.searchFilter.toLowerCase())) {
              return true;
            }
          }

          return false;
        }
      );
    }
  }
}
</script>

<style scoped>
.tk-submission-thematic-container {
  border-radius: 15px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid var(--v-thematicBorder-base);
  width: 100%;
  background-color: var(--v-thematicBackground-base);
  overflow: hidden;
}

.tk-submission-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: var(--v-thematicHeader-base);
}

.tk-submission-thematic-title {
  font-size: 16px;
  font-weight: bolder;
}

.tk-submission-chart {
  margin-bottom: 13px;
  margin-top: 13px;
}

.tk-submission-icon {
  height: 36px;
  display: block;
}

.tk-submission-thematic-content {
  padding: 0px 20px;
  width: 100%;
  margin-bottom: -1px;
}
</style>
