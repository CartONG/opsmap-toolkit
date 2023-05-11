<template lang="html">
  <div>
    <div class="basemap-selector-trigger-container">
      <v-btn icon color="primary" small @click="showBasemap = !showBasemap">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" v-bind="attrs" v-on="on">
              mdi-dots-vertical
            </v-icon>
          </template>
          <span>{{ $t("map.legendBasemaps") }}</span>
        </v-tooltip>
      </v-btn>
    </div>
    <transition name="fade-in">
      <div v-show="showBasemap">
        <v-tooltip right v-for="item in basemaps.basemapsList" :key="item.id">
          <template v-slot:activator="{ on, attrs }">
            <div
              :key="item.id"
              class="basemap-selector"
              :style="setBasemapSelectorStyle(item)"
              v-bind="attrs"
              v-on="on"
              @click="setBasemap(item.id)"
            ></div>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  TKBasemapDescription,
  TKBaseMapsCollection
} from "@/domain/map/TKBasemaps";
import { TKColors } from "@/domain/utils/TKColors";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TKMapBasemapPicker extends Vue {
  @Prop()
  basemaps!: TKBaseMapsCollection;
  showBasemap = false;

  setBasemap(id: number) {
    this.basemaps.selected = id;
  }
  setBasemapSelectorStyle(bm: TKBasemapDescription) {
    return {
      border:
        this.basemaps.selected === bm.id ? `${TKColors.ACCENT} solid 3px` : "",
      backgroundImage: `url(${bm.img})`
    };
  }
}
</script>
<style scoped>
.basemap-selector-trigger-container {
  margin-top: 8px;
  margin-left: 8px;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: var(--v-background-base);
  border: 1px solid var(--v-border-base);
  border-radius: 50%;
}

.basemap-selector {
  margin-top: 8px;
  margin-left: 8px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-size: 45px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}
</style>
