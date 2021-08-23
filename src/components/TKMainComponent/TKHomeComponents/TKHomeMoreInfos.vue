<template>
  <div class="tk-home-moreinfos">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-home-moreinfos-title">
        {{ $t("home.moreInfosTitle").toUpperCase() }}
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
import { TKOpsmapConfiguration } from "@/domain";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class TKHomeIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  content = TKGetLocalValue(
    this.appConfig.opsmapDescr,
    this.$root.$i18n.locale
  );

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    if (this.appConfig) {
      this.content = TKGetLocalValue(
        this.appConfig.opsmapDescr,
        this.$root.$i18n.locale
      );
    }
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
  border: 2px solid #f1f3f3;
  box-sizing: border-box;
  background-color: var(--v-background-base);
  width: 100%;
  padding-top: 42px;
  padding-bottom: 42px;
  padding-left: 30px;
  padding-right: 30px;
}

.tk-home-moreinfos-title {
  display: block;
  width: 10%;
  font-weight: bold;
  font-size: 12px;
  color: var(--v-secondary-base);
  letter-spacing: 0.86px;
  min-width: 100px;
}

.tk-home-moreinfos-content {
  width: 85%;
  font-size: 16px;
  color: var(--v-primary-base);
  line-height: 1.375;
  text-align: justify;
  text-justify: inter-word;
}
</style>
