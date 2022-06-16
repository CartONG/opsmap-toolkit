<template>
  <div class="tk-camp-subtitle">
    <transition mode="out-in" name="fade-in">
      <div :key="name" class="tk-camp-subtitle">
        {{ name }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class TKCampSubtitle extends Vue {
  name = "";
  get dataset() {
    return TKDatasetModule.dataset;
  }

  @Watch("$root.$i18n.locale")
  @Watch("dataset.currentCamp", { immediate: true })
  onChange() {
    this.name = this.dataset.currentCamp
      ? this.dataset.currentCamp.name
      : this.$root.$i18n.t("site.subtitlePlaceholder").toString();
  }
}
</script>

<style scoped>
.tk-camp-subtitle {
  font-size: 30px;
  line-height: 1.467;
}

.tk-camp-subtitle-placeholder {
  font-size: 30px;
  line-height: 1.467;
}
</style>
