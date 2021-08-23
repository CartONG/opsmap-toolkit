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
        <span>{{ $t("map.legendZoomIn") }}</span>
      </v-tooltip>
    </div>
    <div class="tk-hseparator" />
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
    <div class="tk-hseparator" />
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
            <v-icon>mdi-stretch-to-page-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("map.legendBbox") }}</span>
      </v-tooltip>
    </div>
    <div class="tk-hseparator" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMapZoom extends Vue {}
</script>
<style scoped>
.tk-map-zoom {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #f1f3f3;
  display: flex;
  flex-flow: column nowrap;
  background-color: #ffffff;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}

.tk-icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tk-hseparator {
  background-color: #00000011;
  height: 1px;
  width: 100%;
}
</style>
