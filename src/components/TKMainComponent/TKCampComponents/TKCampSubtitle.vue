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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  name = "";

  @Watch("$root.$i18n.locale")
  @Watch("dataset.currentCamp", { immediate: true })
  onChange() {
    this.name = this.dataset.currentCamp
      ? this.dataset.currentCamp.infos.name
      : this.$root.$i18n.t("site.subtitlePlaceholder").toString();
  }
}
</script>

<style scoped>
.tk-camp-subtitle {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}

.tk-camp-subtitle-placeholder {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}
</style>
