<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />
    <TKMapFilters class="tk-map-filters" :dataset="dataset" />
    <TKMapBasemapPicker class="tk-basemap-picker" :basemaps="basemaps" />
  </div>
</template>

<script lang="ts">
/* eslint-disable@typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  LineLayer,
  LngLatLike,
  Style,
  SymbolLayer
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TKOpsmapConfiguration } from "@/app/TKOpsmapConfiguration";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";
import TKMapFilters from "./TKMapFilters.vue";
import { TKMapCamps } from "@/domain/map/TKMapCamps";
import { TKMapBoundaries } from "@/domain/map/TKMapBoundaries";
import { TKMapLayers, TKMapLayersStyle } from "@/domain/map/TKMapLayers";
import { TKBasemapsLayer } from "@/domain/map/TKBasemaps";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { Point } from "geojson";

@Component({
  components: {
    TKMapBasemapPicker,
    TKMapFilters,
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  @Prop({ default: () => [] })
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly geoDataset!: TKGeoDataset;

  map!: mapboxgl.Map;
  bound!: mapboxgl.LngLatBounds;
  mapCamps: TKMapCamps | null = null;
  mapBoundaries: TKMapBoundaries | null = null;
  mapMarkersList = [
    "planned_site",
    "planned_site_selected",
    "spontaneous_site",
    "spontaneous_site_selected"
  ];
  markersLoadedCount = 0;
  basemaps = TKBasemapsLayer;

  mounted() {
    this.initMap();
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  // Initialisation of component
  @Watch("dataset", { immediate: true })
  datasetLoaded() {
    if (this.dataset) {
      this.mapCamps = new TKMapCamps(
        this.dataset.filteredCampsList,
        this.dataset.currentCamp
      );
      if (this.mapBoundaries) {
        this.mapBoundaries.changeStyle(this.dataset, this.map, this.bound);
      }
    }
  }

  // Change on filtered data -> why rebuild the whole TKMapCamps list ?
  // TODO: improve this !!!!
  @Watch("dataset.lastModification")
  currentCampChanged() {
    if (this.mapBoundaries) {
      this.mapBoundaries.changeStyle(this.dataset, this.map, this.bound);
    }
    this.mapCamps = new TKMapCamps(
      this.dataset.filteredCampsList,
      this.dataset.currentCamp
    );
    const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.NOTSELECTEDCAMPSSOURCE
    ) as mapboxgl.GeoJSONSource;
    otherCampsSource?.setData(this.mapCamps.filteredCamps.otherCamps);
    const selectedCampSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.SELECTEDCAMPSOURCE
    ) as mapboxgl.GeoJSONSource;
    selectedCampSource?.setData(this.mapCamps.filteredCamps.selectedCamp);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  @Watch("geoDataset", { immediate: true })
  geoDatasetLoaded() {
    if (this.geoDataset) {
      this.mapBoundaries = new TKMapBoundaries(
        this.geoDataset,
        this.appConfig.spatial
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
          this.appConfig.mapConfig.bounds[0],
          this.appConfig.mapConfig.bounds[1]
        ),
        new mapboxgl.LngLat(
          this.appConfig.mapConfig.bounds[2],
          this.appConfig.mapConfig.bounds[3]
        )
      );
    }
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: "tk-map",
        style: this.basemaps.basemapsList[0].style,
        accessToken: this.appConfig.mapConfig.token,
        bounds: this.bound
      });

      this.map.on("load", () => {
        this.addImages();

        if (this.mapBoundaries) {
          this.mapBoundaries.changeStyle(this.dataset, this.map, this.bound);
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
    if (!this.map.getSource(TKMapLayers.COUNTRYMASKSOURCE)) {
      this.map.addSource(TKMapLayers.COUNTRYMASKSOURCE, {
        type: "geojson",
        data: `${process.env.BASE_URL}/${this.appConfig.spatial.admin0LocalURL}`
      });
    }

    if (this.mapBoundaries) {
      if (!this.map.getSource(TKMapLayers.ADMIN1SOURCE)) {
        this.map.addSource(TKMapLayers.ADMIN1SOURCE, {
          type: "geojson",
          data: this.mapBoundaries?.admin1
        });
      }

      if (!this.map.getSource(TKMapLayers.ADMIN2SOURCE)) {
        this.map.addSource(TKMapLayers.ADMIN2SOURCE, {
          type: "geojson",
          data: this.mapBoundaries?.admin2
        });
      }
    }
    // Add Camps
    if (this.mapCamps) {
      if (!this.map.getSource(TKMapLayers.NOTSELECTEDCAMPSSOURCE)) {
        this.map.addSource(TKMapLayers.NOTSELECTEDCAMPSSOURCE, {
          type: "geojson",
          data: this.mapCamps.filteredCamps.otherCamps,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50
        });
      }
      if (!this.map.getSource(TKMapLayers.SELECTEDCAMPSOURCE)) {
        this.map.addSource(TKMapLayers.SELECTEDCAMPSOURCE, {
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
        TKMapLayersStyle[TKMapLayers.COUNTRYMASKLAYER] as FillLayer
      );
    }
    this.map.addLayer(TKMapLayersStyle[TKMapLayers.ADMIN1LAYER] as FillLayer);
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.ADMIN1BORDERLAYER] as LineLayer
    );
    this.map.addLayer(TKMapLayersStyle[TKMapLayers.ADMIN2LAYER] as FillLayer);
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.ADMIN2BORDERLAYER] as LineLayer
    );
    // ADD CLUSTERS
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.CLUSTERSCIRCLELAYER] as CircleLayer
    );
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.CLUSTERSCOUNTLAYER] as SymbolLayer
    );
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.NOTSELECTEDCAMPSLAYER] as SymbolLayer
    );
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.SELECTEDCAMPLAYER] as SymbolLayer
    );

    // // CLUSTERS BEHAVIOR
    this.map.on("click", TKMapLayers.CLUSTERSCOUNTLAYER, e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [TKMapLayers.CLUSTERSCOUNTLAYER]
      });
      const clusterId = features[0].properties?.cluster_id;

      const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
        TKMapLayers.NOTSELECTEDCAMPSSOURCE
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
        this.dataset.setCurrentCampByName(e.features[0].properties?.name);
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
          padding: this.appConfig.mapConfig.padding,
          speed: this.appConfig.mapConfig.zoomspeed
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
  background-color: #fff;
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
</style>
