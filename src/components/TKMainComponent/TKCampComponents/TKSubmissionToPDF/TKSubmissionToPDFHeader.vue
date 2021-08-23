<template>
  <div class="header">
    <div>
      <img src="@/assets/LogoOpsmap.png" class="header-logo" />
      <h3>
        <span class="header-opsmap-title">{{ appName }}</span>
      </h3>
      <img
        v-for="(item, key) in appConfig.headerLogos"
        :key="key"
        :src="item.urlLogo"
        class="header-logo"
      />
    </div>
    <div v-show="appConfig.options.showCCCMLogo" class="header-right">
      <img src="@/assets/LogoCluster.png" class="header-logo" />
    </div>
  </div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class TKSubmissionToPDFHeader extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  appName = "";

  mounted() {
    this.updateAppName();
  }

  // Global infos
  @Watch("appConfig.name")
  @Watch("$root.$i18n.locale")
  updateAppName() {
    this.appName = TKGetLocalValue(
      this.appConfig.name,
      this.$root.$i18n.locale
    ).toUpperCase();
  }
}
</script>

<style scoped>
/* HEADER ************************************************************/
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 12mm;
}

.header-opsmap-title {
  color: var(--v-accent-base);
  letter-spacing: 1.5;
  font-weight: 700;
  font-size: 18px;
  text-align: left;
}

.header-logo {
  text-decoration: none;
  height: 100%;
}

.header > div {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 100%;
}
</style>
