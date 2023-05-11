<template>
  <div class="tk-home-moreinfos">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-home-moreinfos-title">
        {{
          $t("home.moreInfosTitle")
            .toString()
            .toUpperCase()
        }}
      </div>
    </transition>
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-home-moreinfos-content">
        <span v-html="content"></span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TKHomeIndicators extends Vue {
  content = TKGetLocalValue(
    TKConfigurationModule.configuration.opsmapDescr,
    this.$root.$i18n.locale
  );

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    this.content = TKGetLocalValue(
      TKConfigurationModule.configuration.opsmapDescr,
      this.$root.$i18n.locale
    );
  }
}
</script>

<style scoped>
.tk-home-moreinfos {
  display: flex;
  flex-flow: row wrap;
  row-gap: 30px;
  justify-content: space-between;
  align-items: top;
  width: 100%;
}

.tk-home-moreinfos-title {
  display: block;
  width: 30%;
  font-weight: bold;
  font-size: 12px;
  color: var(--v-secondary-base);
  letter-spacing: 0.86px;
  min-width: 100px;
}

.tk-home-moreinfos-content {
  width: 65%;
  font-size: 16px;
  color: var(--v-primary-base);
  line-height: 1.375;
  text-align: justify;
  text-justify: inter-word;
}
</style>
