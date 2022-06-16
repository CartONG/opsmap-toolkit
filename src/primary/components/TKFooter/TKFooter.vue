<template lang="html">
  <div class="tk-footer">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-footer-disclaimer">
        <div class="tk-footer-disclaimer-title">
          <p>{{ $t("footer.moreInfos").toUpperCase() }}</p>
        </div>
        <div class="tk-footer-disclaimer-text">
          <p>
            <span
              v-html="$t('footer.moreInfosText', { version: version })"
            ></span>
          </p>
        </div>
      </div>
    </transition>
    <div class="tk-footer-logos">
      <TKFooterLogoItem
        v-for="(item, key) in appConfig.footerLogos"
        :key="key"
        :logoGroup="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKFooterLogoItem from "./TKFooterLogoItem.vue";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component({
  components: {
    TKFooterLogoItem
  }
})
export default class TKFooter extends Vue {
  version = process.env.VUE_APP_VERSION;

  get appConfig() {
    return TKConfigurationModule.configuration;
  }
}
</script>

<style scoped>
.tk-footer {
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: column wrap;
}

.tk-footer-disclaimer {
  display: flex;

  background-color: var(--v-backgroundSecondary-base);
  flex-flow: row wrap;
  width: 100%;
  row-gap: 30px;
  justify-content: space-between;
  align-items: top;
  padding-top: 42px;
  padding-bottom: 42px;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-footer-ocha-credits {
  padding-bottom: 42px;
}

.tk-footer-disclaimer-title {
  display: block;
  font-weight: bold;
  font-size: 12px;
  color: var(--v-secondary-base);
  letter-spacing: 0.86px;
  min-width: 100px;
  width: 10%;
}

.tk-footer-disclaimer-text {
  font-size: 16px;
  color: var(--v-primary-base);
  line-height: 1.375;
  width: 85%;
  text-align: justify;
  text-justify: inter-word;
}

.tk-footer-logos {
  display: flex;
  flex-flow: row nowrap;
  padding-bottom: var(--padding-large);
  padding-top: var(--padding-large);
  justify-content: space-evenly;
}
</style>
