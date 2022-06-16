<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-title">
      <span class="tk-title-base">
        {{ title }}
      </span>

      <br />
      <span class="tk-title-country">
        {{ appName }}
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { toTitleCase } from "@/domain/utils/TKStringUtils";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component
export default class TKTitle extends Vue {
  appName = toTitleCase(
    TKGetLocalValue(
      TKConfigurationModule.configuration.name,
      this.$root.$i18n.locale
    )
  );

  title = TKGetLocalValue(
    TKConfigurationModule.configuration.title,
    this.$root.$i18n.locale
  );

  @Watch("$root.$i18n.locale")
  handeLocale() {
    this.appName = toTitleCase(
      TKGetLocalValue(
        TKConfigurationModule.configuration.name,
        this.$root.$i18n.locale
      )
    );

    this.title = TKGetLocalValue(
      TKConfigurationModule.configuration.title,
      this.$root.$i18n.locale
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
  color: var(--v-autocomplete-base);
  font-size: 40px;
  font-weight: bold;
}
</style>
