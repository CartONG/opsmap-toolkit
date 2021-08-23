import { Style } from "mapbox-gl";

export interface TKBasemapDescription {
  id: number;
  name: string;
  img: string;
  style: string | Style | undefined;
}

export interface TKBaseMapsCollection {
  selected: number;
  basemapsList: TKBasemapDescription[];
}

export const TKBasemapsLayer: TKBaseMapsCollection = {
  selected: 1,
  basemapsList: [
    {
      id: 1,
      name: "Opsmap Basemap",
      img:
        "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/basemap_opsmap.png",
      style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4"
    },
    {
      id: 2,
      name: "Satellite Imagery",
      img:
        "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/basemap_satellite.png",
      style: "mapbox://styles/unhcr/citbmkkct00322jo6ocdxdl3h"
    },
    {
      id: 3,
      name: "Humanitarian OpenStreetMap",
      img:
        "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/basemap_osm.png",
      style: {
        version: 8,
        sources: {
          "osm-raster-tiles": {
            type: "raster",
            tiles: ["https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              "Humanitarian OpenStreetMap, © © OpenStreetMap contributors, CC-BY-SA, Tiles courtesy of Humanitarian OpenStreetMap Team"
          }
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-raster-tiles",
            minzoom: 0,
            maxzoom: 22
          }
        ],
        glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
      }
    }
  ]
};
