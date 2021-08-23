<template lang="html">
  <div class="tk-header">
    <div class="tk-header-left">
      <button class="tk-header-logo-opsmap-container" v-on:click="logoClicked">
        <img
          src="@/assets/LogoOpsmap.png"
          alt="Opsmap"
          class="tk-header-logo-cccm"
        />
        <h3>
          <transition mode="out-in" name="fade-in">
            <span :key="$root.$i18n.locale" class="tk-header-title-opsmap">{{
              appName.toUpperCase()
            }}</span>
          </transition>
        </h3>
      </button>
      <div v-for="item in appConfig.headerLogos" :key="item.name">
        <a :href="item.urlRedirection" target="_blank">
          <img
            :src="item.urlLogo"
            :alt="item.name"
            class="tk-header-logo-cccm"
          />
        </a>
      </div>
    </div>
    <div class="tk-header-right">
      <div
        class="tk-header-logo-cccm-container"
        v-show="appConfig.options.showCCCMLogo"
      >
        <a href="https://cccmcluster.org" target="_blank">
          <img
            src="@/assets/LogoCluster.png"
            alt="CCCM"
            class="tk-header-logo-cccm"
          />
        </a>
      </div>

      <v-btn-toggle
        v-model="language"
        mandatory
        group
        dense
        class="tk-header-buttons"
        color="accent"
        v-if="locales.length > 1"
      >
        <div
          v-for="(locale, key) in locales"
          :key="locale"
          class="tk-buttons-container"
        >
          <div v-if="key > 0" class="tk-header-buttons-sep"></div>
          <v-btn plain text :value="locale">{{ locale.toUpperCase() }}</v-btn>
        </div>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/app/TKOpsmapConfiguration";
import { headerLogoBus } from "@/components/TKHeaderLogoBus";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
  locales = this.$root.$i18n.availableLocales;

  appName = this.appConfig.name.en;
  @Watch("$root.$i18n.locale")
  handeLocale() {
    this.appName = TKGetLocalValue(
      this.appConfig.name,
      this.$root.$i18n.locale
    );
  }

  language = this.$root.$i18n.locale;
  @Watch("language")
  // whenever question changes, this function will run
  onLanguageChanged(val: string) {
    this.$root.$i18n.locale = val;
    // This is useless.
  }

  logoClicked() {
    headerLogoBus.$emit("switchToHomePage");
  }
}
</script>

<style>
.tk-header-buttons .v-btn--active > .v-btn__content {
  color: var(--v-accent-base) !important;
}
</style>

<style scoped>
.tk-header {
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
  padding-top: 8px;
  padding-bottom: 8px;
  row-gap: 8px;
}

.tk-header-left {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
  row-gap: 8px;
}

.tk-header-logo-opsmap-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
}

.tk-header-title-opsmap {
  color: var(--v-accent-base);
  letter-spacing: 1.5;
  font-weight: 700;
  font-size: 18px;
  text-align: left;
}

.tk-header-logo-cccm-container {
  display: block;
  height: 52px;
  width: 172px;
  border-radius: 8px;
  outline: hidden;
}

.tk-header-logo-cccm {
  height: 52px;
}

.tk-header-right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 10px;
  row-gap: 8px;
}

.tk-buttons-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.tk-header-buttons {
  flex-basis: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0px;
  color: #919191;
  font-size: 13px;
  font-weight: bold;
}

.tk-header-buttons-sep {
  height: 10px;
  width: 2px;
  background-color: #7d7d7d;
}

button:active {
  outline: 0;
}

button:focus {
  outline: 0;
}
</style>
