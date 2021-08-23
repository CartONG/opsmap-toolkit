import { TKCampTypesValues } from "@/domain/survey/TKCamp";

export enum TKMapLayers {
  ADMIN1SOURCE = "admin1Source",
  ADMIN1LAYER = "admin1Layer",
  ADMIN1BORDERLAYER = "admin1BorderLayer",
  ADMIN2SOURCE = "admin2Source",
  ADMIN2LAYER = "admin2Layer",
  ADMIN2BORDERLAYER = "admin2BorderLayer",
  COUNTRYMASKSOURCE = "countryMask",
  COUNTRYMASKLAYER = "countryMaskLayer",
  SELECTEDCAMPSOURCE = "selectedCamp",
  SELECTEDCAMPLAYER = "selectedCampLayer",
  NOTSELECTEDCAMPSSOURCE = "notSelectedCamps",
  NOTSELECTEDCAMPSLAYER = "notSelectedCampsLayer",
  CLUSTERSCIRCLELAYER = "clustersCircle",
  CLUSTERSCOUNTLAYER = "clustersCount"
}

export const TKMapLayersStyle = {
  [TKMapLayers.COUNTRYMASKLAYER]: {
    id: TKMapLayers.COUNTRYMASKLAYER,
    type: "fill",
    source: TKMapLayers.COUNTRYMASKSOURCE,
    layout: {},
    paint: {
      "fill-color": "#142f4b",
      "fill-opacity": 0,
      "fill-opacity-transition": { duration: 1000 }
    }
  },
  [TKMapLayers.ADMIN1LAYER]: {
    id: TKMapLayers.ADMIN1LAYER,
    type: "fill",
    source: TKMapLayers.ADMIN1SOURCE,
    layout: {},
    paint: {
      "fill-color": "#428fdf",
      "fill-opacity": [
        "match",
        ["get", "display"],
        "hide",
        0.0,
        "discrete",
        0.1,
        "focus",
        0.1,
        0.0
      ]
    }
  },
  [TKMapLayers.ADMIN1BORDERLAYER]: {
    id: TKMapLayers.ADMIN1BORDERLAYER,
    type: "line",
    source: TKMapLayers.ADMIN1SOURCE,
    layout: {},
    paint: {
      "line-color": "#428fdf",
      "line-width": [
        "match",
        ["get", "display"],
        "hide",
        0,
        "discrete",
        2,
        "focus",
        4,
        0.0
      ],
      "line-opacity": [
        "match",
        ["get", "display"],
        "hide",
        0.0,
        "discrete",
        1.0,
        "focus",
        1.0,
        0.0
      ]
    }
  },
  [TKMapLayers.ADMIN2LAYER]: {
    id: TKMapLayers.ADMIN2LAYER,
    type: "fill",
    source: TKMapLayers.ADMIN2SOURCE,
    layout: {},
    paint: {
      "fill-color": "#428fdf",
      "fill-opacity": [
        "match",
        ["get", "display"],
        "hide",
        0.0,
        "discrete",
        0.1,
        "focus",
        0.1,
        0.0
      ]
    }
  },
  [TKMapLayers.ADMIN2BORDERLAYER]: {
    id: TKMapLayers.ADMIN2BORDERLAYER,
    type: "line",
    source: TKMapLayers.ADMIN2SOURCE,
    layout: {},
    paint: {
      "line-color": "#428fdf",
      "line-width": [
        "match",
        ["get", "display"],
        "hide",
        0,
        "discrete",
        2,
        "focus",
        4,
        0.0
      ],
      "line-opacity": [
        "match",
        ["get", "display"],
        "hide",
        0.0,
        "discrete",
        1.0,
        "focus",
        1.0,
        0.0
      ]
    }
  },
  [TKMapLayers.CLUSTERSCIRCLELAYER]: {
    id: TKMapLayers.CLUSTERSCIRCLELAYER,
    type: "circle",
    source: TKMapLayers.NOTSELECTEDCAMPSSOURCE,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#000000",
      "circle-radius": ["step", ["get", "point_count"], 10, 10, 15, 30, 20]
    }
  },
  [TKMapLayers.CLUSTERSCOUNTLAYER]: {
    id: TKMapLayers.CLUSTERSCOUNTLAYER,
    type: "symbol",
    source: TKMapLayers.NOTSELECTEDCAMPSSOURCE,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Arial Unicode MS Bold"],
      "text-size": 12
    },
    paint: {
      "text-color": "#ffffff"
    }
  },
  [TKMapLayers.NOTSELECTEDCAMPSLAYER]: {
    id: TKMapLayers.NOTSELECTEDCAMPSLAYER,
    type: "symbol",
    source: TKMapLayers.NOTSELECTEDCAMPSSOURCE,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": [
        "match",
        ["get", "type"],
        TKCampTypesValues.PLANNED,
        "planned_site",
        TKCampTypesValues.SPONTANEOUS,
        "spontaneous_site",
        "planned_site" // everything else
      ],
      "icon-size": 0.25
    }
  },
  [TKMapLayers.SELECTEDCAMPLAYER]: {
    id: TKMapLayers.SELECTEDCAMPLAYER,
    type: "symbol",
    source: TKMapLayers.SELECTEDCAMPSOURCE,
    layout: {
      "icon-image": [
        "match",
        ["get", "type"],
        TKCampTypesValues.PLANNED,
        "planned_site_selected",
        TKCampTypesValues.SPONTANEOUS,
        "spontaneous_site_selected",
        "planned_site_selected" // everything else
      ],
      "icon-size": 0.25
    }
  }
};
