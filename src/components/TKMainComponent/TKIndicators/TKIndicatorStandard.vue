<template>
  <div class="tk-indicator-container">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div class="tk-indicator-subcontainer">
          <div class="tk-indicator-value" v-bind="attrs" v-on="on">
            <transition mode="out-in" name="fade-in">
              <div :key="value" class="tk-indicator-value-number">
                {{ value }}
              </div>
            </transition>
            <transition mode="out-in" name="fade-in">
              <div
                :key="$root.$i18n.locale"
                class="tk-indicator-value-decription"
              >
                {{ name }}
              </div>
            </transition>
          </div>
          <div class="tk-indicator-icon-container">
            <img class="tk-indicator-icon" :src="iconUrl" />
          </div>
        </div>
      </template>
      <span>{{ name }} : {{ value }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";

@Component
export default class TKIndicatorStandard extends Vue {
  @Prop() readonly indicator!: TKIndicator;
  iconUrl = "";
  value = "";
  name = "";
  isSiteOccupation = false;
  siteOccupationValues = {
    label: "",
    occupationTreshold: 0
  };

  @Watch("indicator", { immediate: true })
  handleIndicatorChange() {
    this.iconUrl = this.indicator ? TKIconUrl(this.indicator.iconOchaName) : "";
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.indicator) {
      this.name = TKGetLocalValue(
        this.indicator.nameLabel,
        this.$root.$i18n.locale
      );
      this.value = TKGetLocalValue(
        this.indicator.valueLabel,
        this.$root.$i18n.locale
      );
    } else {
      this.value = "";
      this.name = "";
    }
  }
}
</script>

<style scoped>
.tk-indicator-container {
  display: flex;
  width: 100%;
}

.tk-indicator-subcontainer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 36px;
  align-items: left;
  width: 100%;
}

.tk-indicator-icon-container {
  padding-top: 9px;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.tk-indicator-icon {
  height: 36px;
  width: auto;
}
.tk-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  font-size: 40px;
  padding-top: 13px;
  padding-bottom: 13px;
  line-height: 1.25;
  justify-content: flex-start;
  height: 100%;
  width: 80%;
}

.tk-indicator-value-number {
  width: 100%;
  color: var(--v-accent-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tk-indicator-value-decription {
  color: var(--v-quaternary-base);
  font-weight: bolder;
  font-size: 16px;
  line-height: 17px;
  white-space: normal;
}
</style>
