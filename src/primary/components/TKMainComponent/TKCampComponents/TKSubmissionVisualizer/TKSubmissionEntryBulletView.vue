<template lang="html">
  <div class="tk-submission-entry-container">
    <transition mode="out-in" name="fade-in">
      <div :key="question" class="tk-entry-field-name">
        {{ question }}
      </div>
    </transition>
    <ul class="tk-entry-field-value">
      <li v-for="(answer, key) in answers" :key="key">
        <transition mode="out-in" name="fade-in">
          <div :key="answer">
            {{
              answer !== "" ? (isNaN(+answer) ? answer : $n(answer)) : answer
            }}
          </div>
        </transition>
      </li>
    </ul>

    <div>
      <div class="tk-trafficlight-container">
        <div v-if="displayTrafficLight">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="tk-trafficlight"
                :style="trafficLightColor"
              ></div>
            </template>
            <span>{{ $t(trafficLightCategory) }}</span>
          </v-tooltip>
        </div>
        <div v-else class="tk-trafficlight"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryBullet } from "@/domain/survey/TKSubmissionEntry";
@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryBullet;

  question = "";
  answers: Array<string> = [];
  displayTrafficLight = false;
  trafficLightCategory = "";
  trafficLightColor = {
    backgroundColor: "none"
  };

  @Watch("entry", { immediate: true })
  onentryChanged() {
    switch (this.entry.trafficLightColor) {
      case TKTrafficLightValues.OK:
        this.trafficLightColor.backgroundColor = "green";
        this.trafficLightCategory = "trafficlight.ok";
        break;
      case TKTrafficLightValues.WARNING:
        this.trafficLightColor.backgroundColor = "yellow";
        this.trafficLightCategory = "trafficlight.warning";
        break;
      case TKTrafficLightValues.DANGER:
        this.trafficLightColor.backgroundColor = "orange";
        this.trafficLightCategory = "trafficlight.danger";
        break;
      case TKTrafficLightValues.CRITICAL:
        this.trafficLightColor.backgroundColor = "#e91d1d";
        this.trafficLightCategory = "trafficlight.critical";
        break;
      default:
        this.trafficLightColor.backgroundColor = "purple";
        this.trafficLightCategory = "trafficlight.other";
        break;
    }
    this.displayTrafficLight = this.entry.trafficLight && this.entry.isAnswered;
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.entry && this.entry.fieldLabel && this.entry.answersLabels) {
      this.question = TKGetLocalValue(
        this.entry.fieldLabel,
        this.$root.$i18n.locale
      );
      this.answers = this.entry.answersLabels.map(label => {
        return TKGetLocalValue(label, this.$root.$i18n.locale);
      });
    } else {
      this.question = "";
      this.answers = [];
    }
  }
}
</script>

<style scoped>
.tk-submission-entry-container {
  min-width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-height: 30px;
  column-gap: 2px;
  font-weight: bold;
  font-size: 11px;
}

.tk-entry-field-name {
  color: var(--v-secondary-base);
  text-align: left;
  flex-grow: 2;
  overflow: auto;
}

.tk-entry-field-value {
  color: var(--v-primary-base);
  text-align: right;
  list-style: none;
}
.tk-entry-field-value > li {
  white-space: nowrap;
}

.tk-trafficlight-container {
  margin-right: -20px;
}

.tk-trafficlight {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: none;
}
</style>
