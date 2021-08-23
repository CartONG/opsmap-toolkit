<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-title">
      <span class="tk-title-base">
        {{ $t("main.title") }}
      </span>

      <br />
      <span class="tk-title-country">
        {{ appName }}
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/app/TKOpsmapConfiguration";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { toTitleCase } from "@/domain/ui/TKStringUtils";

@Component
export default class TKTitle extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  appName = toTitleCase(
    TKGetLocalValue(this.appConfig.name, this.$root.$i18n.locale)
  );
  @Watch("$root.$i18n.locale")
  handeLocale() {
    this.appName = toTitleCase(
      TKGetLocalValue(this.appConfig.name, this.$root.$i18n.locale)
    );
  }
}
</script>

<style scoped>
.tk-title-base {
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-title-country {
  color: var(--v-campTitle-base);
  font-size: 40px;
  font-weight: bold;
}
</style>
