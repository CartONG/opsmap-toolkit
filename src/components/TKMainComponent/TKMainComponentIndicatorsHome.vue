<template>
  <div>
    <TKHomeIndicators
      class="tk-home-indicators"
      :appConfig="appConfig"
      :dataset="dataset"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKHomeIndicators } from "./TKHomeComponents";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKOpsmapConfiguration } from "@/domain";
@Component({
  components: {
    TKHomeIndicators
  }
})
export default class TKMainComponentIndicatorsCamp extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
}
</script>

<style scoped></style>
