<template>
  <div>
    <TKCampIndicators :appConfig="appConfig" :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKCampIndicators } from "./TKCampComponents";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKOpsmapConfiguration } from "@/domain";
@Component({
  components: {
    TKCampIndicators
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
