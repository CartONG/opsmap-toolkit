import { Feature, FeatureCollection } from "geojson";
import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import {
  TKDatasetFilterer,
  TKFilters
} from "@/domain/survey/TKDatasetFilterer";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKMapLayers } from "./TKMapLayers";
import { TKSpatialDescription } from "../opsmapConfig/TKSpatialDescription";

export class TKMapBoundaries {
  public admin1: FeatureCollection;
  public admin2: FeatureCollection;
  public spatialDescription: TKSpatialDescription;

  constructor(
    geodataset: TKGeoDataset,
    spatialDescription: TKSpatialDescription
  ) {
    this.admin1 = geodataset.admin1;
    this.admin2 = geodataset.admin2;
    this.spatialDescription = spatialDescription;
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  changeStyle(
    dataset: TKDatasetFilterer,
    map: mapboxgl.Map,
    bound: LngLatBounds
  ): void {
    let setZoom;
    const setZoom1 = this.setAdmin1Style(dataset);
    const setZoom2 = this.setAdmin2Style(dataset);
    switch (dataset.levelToZoom) {
      case TKFilters.SURVEY:
        this.mapFitBounds(bound, map);
        for (const item of this.admin1.features) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
        }
        break;
      case TKFilters.ADMIN1:
        setZoom = setZoom1;
        this.setAdmin2Style(dataset);
        if (setZoom) {
          this.mapFitBounds(setZoom, map);
        }
        break;
      case TKFilters.CAMP:
      case TKFilters.ADMIN2:
        setZoom = setZoom2;
        if (setZoom) {
          this.mapFitBounds(setZoom, map);
        }
        break;
      default:
        break;
    }
    if (dataset.currentCamp) {
      this.mapFitBounds(
        new LngLat(
          dataset.currentCamp.infos.lng,
          dataset.currentCamp.infos.lat
        ).toBounds(100),
        map
      );
    }
    (map.getSource(
      TKMapLayers.ADMIN1SOURCE
    ) as mapboxgl.GeoJSONSource)?.setData(this.admin1);
    (map.getSource(
      TKMapLayers.ADMIN2SOURCE
    ) as mapboxgl.GeoJSONSource)?.setData(this.admin2);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  initLayersStyle(map: mapboxgl.Map) {
    // Split in two tempos -> for transition
    map.setPaintProperty(TKMapLayers.COUNTRYMASKLAYER, "fill-opacity", 0.5);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  setAdmin1Style(dataset: TKDatasetFilterer) {
    let shouldMapZoom = null;
    const currentadmin1List = dataset.filteredAdmin1List.map(
      item => item.pcode
    );
    for (const item of this.admin1.features) {
      if (item.properties) {
        if (dataset.currentAdmin2) {
          item.properties.display = "hide";
        } else if (
          dataset.currentAdmin1 &&
          dataset.currentAdmin1.pcode ===
            item.properties[this.spatialDescription.adm1DBPcode]
        ) {
          shouldMapZoom = this.getBoundingBoxFromCoordinatesArray(item);
          item.properties.display = "focus";
        } else if (
          currentadmin1List.includes(
            item.properties[this.spatialDescription.adm1DBPcode]
          )
        ) {
          item.properties.display = "hide";
        } else {
          item.properties.display = "hide";
        }
      }
    }
    return shouldMapZoom;
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  setAdmin2Style(dataset: TKDatasetFilterer) {
    let shouldMapZoom = null;
    const currentadmin2List = dataset.filteredAdmin2List.map(
      item => item.pcode
    );
    for (const item of this.admin2.features) {
      if (item.properties) {
        if (
          dataset.currentAdmin2 &&
          dataset.currentAdmin2.pcode ===
            item.properties[this.spatialDescription.adm2DBPcode]
        ) {
          shouldMapZoom = this.getBoundingBoxFromCoordinatesArray(item);
          item.properties.display = "focus";
        } else if (
          currentadmin2List.includes(
            item.properties[this.spatialDescription.adm2DBPcode]
          )
        ) {
          item.properties.display = "hide";
        } else {
          item.properties.display = "hide";
        }
      }
    }
    return shouldMapZoom;
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  mapFitBounds(bounds: LngLatBounds, map: mapboxgl.Map) {
    map.fitBounds(bounds);
  }

  getBoundingBoxFromCoordinatesArray(item: Feature): LngLatBounds {
    const bounds = { xMin: 180, xMax: -180, yMin: 180, yMax: -180 };
    let latitude, longitude;
    if (item.geometry.type === "Polygon") {
      for (const c of item.geometry.coordinates[0]) {
        latitude = c[1];
        longitude = c[0];

        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
      }
    } else if (item.geometry.type === "MultiPolygon") {
      for (const coord of item.geometry.coordinates) {
        for (const c of coord) {
          latitude = (c[1] as unknown) as number;
          longitude = (c[0] as unknown) as number;

          bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
          bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
          bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
          bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }
      }
    }

    return new LngLatBounds(
      [bounds.xMin, bounds.yMin] as LngLatLike,
      [bounds.xMax, bounds.yMax] as LngLatLike
    );
  }
}
