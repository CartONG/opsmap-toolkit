<template>
  <div class="tk-ochacredits">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-ochacredits-text">
        {{ $t("dashboardCredits") }}
        <br />
        {{ $t("appVersion") }}: {{ version }}.{{ build }}
        <br />
        {{ $t("ochaCredits") }}
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          class="tk-ochacredits-text"
        >
          http://creativecommons.org/licenses/by/3.0/
        </a>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKCredits extends Vue {
  version = process.env.VUE_APP_VERSION;
  build = process.env.VUE_APP_GITHEAD;
}
</script>

<style scoped>
.tk-ochacredits {
  background-color: var(--v-sectionBGSecondary-base);
  width: 100%;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-ochacredits-text {
  white-space: nowrap;
  font-size: 14px;
  color: #b3b3b3;
  line-height: 1.375;
  text-align: right;
  text-justify: inter-word;
}
</style>
