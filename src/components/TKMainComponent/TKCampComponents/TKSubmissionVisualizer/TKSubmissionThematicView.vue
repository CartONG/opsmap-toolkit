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
        v-for="entry in thematicData"
        :key="entry.id"
        v-show="
          !visualizerOptions.hideUnanswered ||
            (visualizerOptions.hideUnanswered && entry.isAnswered)
        "
      >
        <TKSubmissionEntryView :entry="entry" :pdfInfos="pdfInfos" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKSubmissionEntryView from "./TKSubmissionEntryView.vue";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizerOptions";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";

@Component({
  components: {
    TKSubmissionEntryView
  }
})
export default class TKSubmissionThematicView extends Vue {
  @Prop()
  readonly submissionThematic!: TKSubmissionThematic;

  thematicData: Array<TKSubmissionEntry> = [];

  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;

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
    this.applyHideUnansweredOption();
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

  @Watch("visualizerOptions.hideUnanswered", { immediate: true })
  applyHideUnansweredOption() {
    // Filter if needed
    if (this.submissionThematic) {
      this.thematicData = this.visualizerOptions.hideUnanswered
        ? this.submissionThematic.data
        : this.submissionThematic.data;
    } else {
      this.thematicData = [];
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
  border: 3px solid #f1f3f3;
  width: 100%;
  background-color: #f1f3f3;
  overflow: hidden;
}

.tk-submission-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: #fff;
}

.tk-submission-thematic-title {
  font-size: 16px;
  font-weight: bolder;
  color: var(--v-quaternary-base);
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
