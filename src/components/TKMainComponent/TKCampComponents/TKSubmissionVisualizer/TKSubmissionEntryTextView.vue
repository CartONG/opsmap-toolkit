<template lang="html">
  <div class="tk-submission-entry-container">
    <transition mode="out-in" name="fade-in">
      <div :key="question" class="tk-entry-field-name">
        {{ question }}
      </div>
    </transition>
    <transition mode="out-in" name="fade-in">
      <div :key="answer" class="tk-entry-field-value">
        {{ answer }}
      </div>
    </transition>

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
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntry";
@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryText;

  question = "";
  answer = "";
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
    if (this.entry && this.entry.fieldLabel && this.entry.answerLabel) {
      this.question = TKGetLocalValue(
        this.entry.fieldLabel,
        this.$root.$i18n.locale
      );
      this.answer = TKGetLocalValue(
        this.entry.answerLabel,
        this.$root.$i18n.locale
      );
    } else {
      this.question = "";
      this.answer = "";
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
  color: #999;
  text-align: left;
  flex-grow: 2;
  overflow: auto;
}

.tk-entry-field-value {
  color: #333;
  text-align: right;
  flex-grow: 2;
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
