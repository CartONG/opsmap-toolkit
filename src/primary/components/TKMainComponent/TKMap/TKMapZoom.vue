<template lang="html">
  <div class="tk-map-zoom">
    <div class="tk-icon-container">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            color="primary"
            @click="$emit('zoomin')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <div>{{ $t("map.legendZoomIn") }}</div>
      </v-tooltip>
    </div>
    <div class="tk-hseparator"></div>
    <div class="tk-icon-container">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            color="primary"
            @click="$emit('zoomout')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("map.legendZoomOut") }}</span>
      </v-tooltip>
    </div>
    <div class="tk-hseparator"></div>
    <div class="tk-icon-container">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            color="primary"
            @click="$emit('zoomreset')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-arrow-expand</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("map.legendBbox") }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMapZoom extends Vue {}
</script>
<style scoped>
.tk-map-zoom {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--v-border-base);
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: column nowrap;
}

.tk-icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tk-hseparator {
  background-color: var(--v-border-base);
  height: 1px;
  width: 100%;
}
</style>
