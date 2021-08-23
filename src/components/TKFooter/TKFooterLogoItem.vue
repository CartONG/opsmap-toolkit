<template lang="html">
  <div class="tk-footer-logos-item-container">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-footer-logos-item-title">
        {{ title }}
      </div>
    </transition>
    <div class="tk-footer-logos-item-logos">
      <div v-for="item in logoDescription.logos" :key="item.name">
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
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogosDescription";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";

@Component
export default class TKFooterLogoItem extends Vue {
  @Prop()
  readonly logoDescription!: TKFooterLogosDescription;

  title = "";

  @Watch("logoDescription", { immediate: true })
  @Watch("$root.$i18n.locale")
  handeLocale() {
    if (this.logoDescription) {
      this.title = TKGetLocalValue(
        this.logoDescription.title,
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
  justify-content: space-between;
}

.tk-footer-logos-item-title {
  color: var(--v-sectionTitle-base);
}

.tk-footer-logos-item-logos {
  display: flex;
  flex-flow: row nowrap;
  vertical-align: middle;
  justify-content: center;
  column-gap: var(--padding-logos);
}

.tk-footer-logos-item-logo {
  height: 52px;
}
</style>
