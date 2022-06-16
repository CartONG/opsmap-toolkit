<template lang="html">
  <div class="tk-footer-logos-item-container">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-footer-logos-item-title">
        {{ title }}
      </div>
    </transition>
    <div class="tk-footer-logos-item-logos">
      <div v-for="item in logoGroup.logos" :key="item.name">
        <a :href="item.urlRedirection" target="_blank">
          <img
            :src="item.urlLogo"
            :alt="item.name"
            class="tk-footer-logos-item-logo"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKLogoGroup } from "@/domain/utils/TKLogo";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";

@Component
export default class TKFooterLogoItem extends Vue {
  @Prop()
  readonly logoGroup!: TKLogoGroup;

  title = "";

  @Watch("logoGroup", { immediate: true })
  @Watch("$root.$i18n.locale")
  handeLocale() {
    if (this.logoGroup) {
      this.title = TKGetLocalValue(
        this.logoGroup.title,
        this.$root.$i18n.locale
      );
    }
  }
}
</script>

<style scoped>
.tk-footer-logos-item-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: 5px;
}

.tk-footer-logos-item-title {
  color: var(--v-sectionTitle-base);
  white-space: nowrap;
}

.tk-footer-logos-item-logos {
  display: flex;
  flex-flow: row nowrap;
  vertical-align: middle;
  justify-content: flex-start;
  column-gap: var(--padding-logos);
  row-gap: var(--padding-logos);
}

.tk-footer-logos-item-logo {
  max-height: 50px;
  max-width: 100%;
}
</style>
