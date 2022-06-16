<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />
    <TKMapFilters class="tk-map-filters" />
    <TKMapBasemapPicker class="tk-basemap-picker" :basemaps="basemaps" />
  </div>
</template>

<script lang="ts">
/* eslint-disable@typescript-eslint/no-non-null-assertion */
import { Component, Vue, Watch } from "vue-property-decorator";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  LineLayer,
  LngLatLike,
  Style,
  SymbolLayer
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";
import TKMapFilters from "./TKMapFilters.vue";
import { TKMapCamps } from "@/domain/map/TKMapCamps";
import { TKMapBoundaries } from "@/domain/map/TKMapBoundaries";
import {
  computeMapLayersStyle,
  TKMapLayers,
  TKMapLayersSource
} from "@/domain/map/TKMapLayers";
import { TKBasemapsLayer } from "@/domain/map/TKBasemaps";
import { Point } from "geojson";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKGeoDatasetModule from "@/store/modules/geodataset/TKGeoDatasetModule";

@Component({
  components: {
    TKMapBasemapPicker,
    TKMapFilters,
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  map!: mapboxgl.Map;
  bound!: mapboxgl.LngLatBounds;
  mapCamps: TKMapCamps | null = null;
  mapBoundaries: TKMapBoundaries | null = null;
  mapMarkersList: Array<string> = [];
  markersLoadedCount = 0;
  basemaps = TKBasemapsLayer;

  mapLayerStyle!: Record<TKMapLayers, {}>;

  mounted() {
    this.initMap();
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  get dataset() {
    return TKDatasetModule.dataset;
  }

  // Initialisation of component
  @Watch("dataset", { immediate: true })
  datasetLoaded() {
    if (TKDatasetModule.dataset) {
      this.mapMarkersList = [];
      Object.keys(TKDatasetModule.dataset.currentSurvey.fdf.siteTypes).map(
        i => {
          const site = TKDatasetModule.dataset.currentSurvey.fdf.siteTypes[i];
          this.mapMarkersList.push(site.iconFileName.normal);
          this.mapMarkersList.push(site.iconFileName.selected);
        }
      );

      this.mapMarkersList = [...new Set(this.mapMarkersList)];

      this.mapLayerStyle = computeMapLayersStyle(
        TKDatasetModule.dataset.currentSurvey.fdf.siteTypes
      );

      this.mapCamps = new TKMapCamps(
        TKDatasetModule.dataset.filteredTypedCampsList,
        TKDatasetModule.dataset.currentCamp
      );
      if (this.mapBoundaries) {
        this.mapBoundaries.changeStyle(
          TKDatasetModule.dataset,
          this.map,
          this.bound
        );
      }
    }
  }

  // Change on filtered data -> why rebuild the whole TKMapCamps list ?
  // TODO: improve this !!!!
  @Watch("dataset.lastModification")
  currentCampChanged() {
    if (this.mapBoundaries) {
      this.mapBoundaries.changeStyle(
        TKDatasetModule.dataset,
        this.map,
        this.bound
      );
    }
    this.mapCamps = new TKMapCamps(
      TKDatasetModule.dataset.filteredTypedCampsList,
      TKDatasetModule.dataset.currentCamp
    );

    const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayersSource.NOTSELECTEDCAMPSSOURCE
    ) as mapboxgl.GeoJSONSource;
    otherCampsSource?.setData(this.mapCamps.filteredCamps.otherCamps);
    const selectedCampSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayersSource.SELECTEDCAMPSOURCE
    ) as mapboxgl.GeoJSONSource;

    selectedCampSource?.setData(this.mapCamps.filteredCamps.selectedCamp);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  get geoDataset() {
    return TKGeoDatasetModule.geoDataset;
  }

  @Watch("geoDataset", { immediate: true })
  geoDatasetLoaded() {
    if (this.geoDataset) {
      this.mapBoundaries = new TKMapBoundaries(
        this.geoDataset,
        TKConfigurationModule.configuration.spatial
      );
    }
  }

  // TODO: source of trouvle right here
  @Watch("basemaps", { deep: true })
  updateBasemap(): void {
    this.basemaps.basemapsList.map(x => {
      if (x.id === this.basemaps.selected) {
        this.map.setStyle(x.style as Style);
        this.map.on("style.load", () => {
          this.addImages();
        });
      }
    });
  }

  @Watch("markersLoadedCount")
  mapMarkersLoaded() {
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.mapCamps
    ) {
      this.addSources();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  initMap(): void {
    if (!this.bound) {
      // Init the map - world level
      this.bound = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(
          TKConfigurationModule.configuration.mapConfig.bounds[0],
          TKConfigurationModule.configuration.mapConfig.bounds[1]
        ),
        new mapboxgl.LngLat(
          TKConfigurationModule.configuration.mapConfig.bounds[2],
          TKConfigurationModule.configuration.mapConfig.bounds[3]
        )
      );
    }
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: "tk-map",
        style: this.basemaps.basemapsList[0].style,
        accessToken: TKConfigurationModule.configuration.mapConfig.token,
        bounds: this.bound
      });

      this.map.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" })
      );

      this.map.on("load", () => {
        this.addImages();

        if (this.mapBoundaries) {
          this.mapBoundaries.changeStyle(
            TKDatasetModule.dataset,
            this.map,
            this.bound
          );
        }
      });
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // layers management
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  addImages() {
    if (!this.map.hasImage(this.mapMarkersList[0])) {
      this.markersLoadedCount = 0;
    }
    this.mapMarkersList.map(img => {
      this.map.loadImage(TKIconUrl(img), (error, image) => {
        if (!this.map.hasImage(img)) {
          this.markersLoadedCount++;
          this.map.addImage(img, image as ImageBitmap);
          if (error) throw error;
        }
      });
    });
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.mapCamps
    ) {
      this.addSources();
    }
  }
  addSources() {
    // Add Geographical boundaries sources
    if (!this.map.getSource(TKMapLayersSource.COUNTRYMASKSOURCE)) {
      this.map.addSource(TKMapLayersSource.COUNTRYMASKSOURCE, {
        type: "geojson",
        data: `${process.env.BASE_URL}/${TKConfigurationModule.configuration.spatial.admin0LocalURL}`
      });
    }

    if (this.mapBoundaries) {
      if (!this.map.getSource(TKMapLayersSource.ADMIN1SOURCE)) {
        this.map.addSource(TKMapLayersSource.ADMIN1SOURCE, {
          type: "geojson",
          data: this.mapBoundaries?.admin1
        });
      }

      if (!this.map.getSource(TKMapLayersSource.ADMIN2SOURCE)) {
        this.map.addSource(TKMapLayersSource.ADMIN2SOURCE, {
          type: "geojson",
          data: this.mapBoundaries?.admin2
        });
      }
    }
    // Add Camps
    if (this.mapCamps) {
      if (!this.map.getSource(TKMapLayersSource.NOTSELECTEDCAMPSSOURCE)) {
        this.map.addSource(TKMapLayersSource.NOTSELECTEDCAMPSSOURCE, {
          type: "geojson",
          data: this.mapCamps.filteredCamps.otherCamps,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50
        });
      }
      if (!this.map.getSource(TKMapLayersSource.SELECTEDCAMPSOURCE)) {
        this.map.addSource(TKMapLayersSource.SELECTEDCAMPSOURCE, {
          type: "geojson",
          data: this.mapCamps.filteredCamps.selectedCamp
        });
      }
    }
    this.addLayers();
  }

  addLayers() {
    // ADD ADMIN BOUNDARIES
    if (!this.map.getLayer(TKMapLayers.COUNTRYMASKLAYER)) {
      this.map.addLayer(
        this.mapLayerStyle[TKMapLayers.COUNTRYMASKLAYER] as FillLayer
      );
    }
    this.map.addLayer(this.mapLayerStyle[TKMapLayers.ADMIN1LAYER] as FillLayer);
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.ADMIN1BORDERLAYER] as LineLayer
    );
    this.map.addLayer(this.mapLayerStyle[TKMapLayers.ADMIN2LAYER] as FillLayer);
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.ADMIN2BORDERLAYER] as LineLayer
    );
    // ADD CLUSTERS
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.CLUSTERSCIRCLELAYER] as CircleLayer
    );
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.CLUSTERSCOUNTLAYER] as SymbolLayer
    );
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.NOTSELECTEDCAMPSLAYER] as SymbolLayer
    );
    this.map.addLayer(
      this.mapLayerStyle[TKMapLayers.SELECTEDCAMPLAYER] as SymbolLayer
    );

    // // CLUSTERS BEHAVIOR
    this.map.on("click", TKMapLayers.CLUSTERSCOUNTLAYER, e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [TKMapLayers.CLUSTERSCOUNTLAYER]
      });
      const clusterId = features[0].properties?.cluster_id;

      const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
        TKMapLayersSource.NOTSELECTEDCAMPSSOURCE
      ) as mapboxgl.GeoJSONSource;
      otherCampsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        this.map.easeTo({
          center: (features[0].geometry as Point).coordinates as LngLatLike,
          zoom: zoom
        });
      });
    });

    // CAMPS BEHAVIOR
    this.map.on("click", TKMapLayers.NOTSELECTEDCAMPSLAYER, e => {
      if (e !== undefined && e.features && e.features?.length > 0) {
        TKDatasetModule.dataset.setCurrentCampByName(
          e.features[0].properties?.name
        );
      }
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.map.on("mouseenter", TKMapLayers.NOTSELECTEDCAMPSLAYER, e => {
      this.map.getCanvas().style.cursor = "pointer";
      if (e.features) {
        const coordinates: [number, number] = [
          e.features[0].properties?.lng,
          e.features[0].properties?.lat
        ];
        const description = `<div>
                                <h4 class="primary--text">${e.features[0].properties?.name} </h4>
                                <h8 class="primary--text">${e.features[0].properties?.lastSubmission}</h8>
                             </div>`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
      }
    });
    this.map.on("mouseleave", TKMapLayers.SELECTEDCAMPLAYER, () => {
      this.map.getCanvas().style.cursor = "";
      popup.remove();
    });
    this.map.on("mouseenter", TKMapLayers.SELECTEDCAMPLAYER, e => {
      this.map.getCanvas().style.cursor = "pointer";
      if (e.features) {
        const coordinates: [number, number] = [
          e.features[0].properties?.lng,
          e.features[0].properties?.lat
        ];
        const description = `<div>
                                <h4 class="primary--text">${e.features[0].properties?.name} </h4>
                                <h8 class="primary--text">${e.features[0].properties?.lastSubmission}</h8>
                             </div>`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
      }
    });
    this.map.on("mouseleave", TKMapLayers.NOTSELECTEDCAMPSLAYER, () => {
      this.map.getCanvas().style.cursor = "";
      popup.remove();
    });

    this.mapBoundaries?.initLayersStyle(this.map);
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Zoom related
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  initZoom(): void {
    if (!this.map) {
      return;
    }
    this.zoomReset();
    this.map.once("zoomend", () => {
      // Avoid multiple zoom variation when on fly
      const scale = new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric"
      });
      this.map.addControl(scale);
    });
  }
  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn();
    }
  }
  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut();
    }
  }
  zoomReset(): void {
    if (this.map) {
      if (this.bound) {
        this.map.fitBounds(this.bound, {
          padding: TKConfigurationModule.configuration.mapConfig.padding,
          speed: TKConfigurationModule.configuration.mapConfig.zoomspeed
        });
      }
    }
  }
}
</script>
<style scoped>
.tk-map-zoom {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.tk-basemap-picker {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

.tk-map-filters {
  position: absolute;
  bottom: 28px;
  right: 8px;
  z-index: 1;
}
</style>

<style>
#tk-map canvas {
  outline: 0 !important;
}

.mapboxgl-ctrl-scale {
  position: absolute;
  bottom: 0px;
  left: 90px;
  text-align: center;
  border: 1px solid var(--v-primary-base);
  border-top: none;
  margin-right: 100px;
}
</style>
