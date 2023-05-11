<template lang="html">
  <div class="tk-submission-entry-container">
    <transition mode="out-in" name="fade-in">
      <div
        :key="question"
        class="tk-entry-field-name"
        :class="{ 'tk-entry-field-name-arab': language === 'ar' }"
      >
        {{ question }}
      </div>
    </transition>
    <transition mode="out-in" name="fade-in">
      <div
        :key="answer"
        class="tk-entry-field-value"
        :class="{ 'tk-entry-field-value-arab': language === 'ar' }"
      >
        {{ answer !== "" ? (isNaN(+answer) ? answer : $n(answer)) : answer }}
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
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntry";
import { TKColors } from "@/domain/utils/TKColors";

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

  get language() {
    return this.$root.$i18n.locale;
  }

  @Watch("entry", { immediate: true })
  onentryChanged() {
    switch (this.entry.trafficLightColor) {
      case TKTrafficLightValues.OK:
        this.trafficLightColor.backgroundColor = TKColors.TRAFFICLIGHT_OK;
        this.trafficLightCategory = "trafficlight.ok";
        break;
      case TKTrafficLightValues.WARNING:
        this.trafficLightColor.backgroundColor = TKColors.TRAFFICLIGHT_WARNING;
        this.trafficLightCategory = "trafficlight.warning";
        break;
      case TKTrafficLightValues.DANGER:
        this.trafficLightColor.backgroundColor = TKColors.TRAFFICLIGHT_DANGER;
        this.trafficLightCategory = "trafficlight.danger";
        break;
      case TKTrafficLightValues.CRITICAL:
        this.trafficLightColor.backgroundColor = TKColors.TRAFFICLIGHT_CRITICAL;
        this.trafficLightCategory = "trafficlight.critical";
        break;
      default:
        this.trafficLightColor.backgroundColor =
          TKColors.TRAFFICLIGHT_UNDEFINED;
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
