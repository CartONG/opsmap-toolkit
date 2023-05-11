import { FeatureCollection } from "geojson";
import { TKSite, TKSiteCoordinates } from "@/domain/survey/TKSite";
import { TKGeoDataset } from "./TKGeoDataset";
import mapboxgl, { LngLat } from "mapbox-gl";
import centroid from "@turf/centroid";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
interface TKFilteredSites {
  selectedSite: FeatureCollection | string;
  otherSites: FeatureCollection;
}

export function getCenterOfBounds(bounds: number[]): LngLat {
  const sw = new mapboxgl.LngLat(bounds[0], bounds[1]);
  const ne = new mapboxgl.LngLat(bounds[2], bounds[3]);
  return new mapboxgl.LngLatBounds(sw, ne).getCenter();
}

export class TKMapSites {
  public filteredSites: TKFilteredSites;

  constructor(private sites: TKSite[], private currentSite: TKSite | null) {
    this.sites = sites;
    this.currentSite = currentSite;
    this.filteredSites = this.filterSites();
  }

  toGeoJSON(sitesArray: TKSite[]): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: sitesArray.map((site: TKSite) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [site.coordinates.lng, site.coordinates.lat]
          },
          properties: {
            id: site.id,
            name: site.name,
            type: site.type.formattedName,
            lastSubmission: site.submissions[0].date,
            lat: site.coordinates.lat,
            lng: site.coordinates.lng,
            admin1: site.admin1,
            admin2: site.admin2
          }
        };
      })
    };
  }

  filterSites(): TKFilteredSites {
    return {
      selectedSite: this.toGeoJSON(
        this.sites.filter(site => site.id === this.currentSite?.id)
      ),
      otherSites: this.toGeoJSON(
        this.currentSite
          ? this.sites.filter(site => site.id !== this.currentSite?.id)
          : this.sites
      )
    };
  }
}

export function computeCentroid(
  site: TKSite,
  geoDataset: TKGeoDataset
): TKSiteCoordinates | false {
  // Compute Admin2 Centroid
  const admin2Feature = geoDataset.admin2.features.filter(
    x =>
      // eslint-disable-next-line
      x.properties![
        TKConfigurationModule.configuration.spatialConfiguration.dbConfig
          .adm2DBPcode
      ] === site.admin2.pcode
  );

  if (admin2Feature.length > 0) {
    // eslint-disable-next-line
    const center = centroid(admin2Feature[0] as any);
    site.coordinates = {
      lng: center.geometry.coordinates[0],
      lat: center.geometry.coordinates[1]
    };
  } else {
    // Compute Admin1 Centroid
    const admin1Feature = geoDataset.admin1.features.filter(
      x =>
        // eslint-disable-next-line
        x.properties![
          TKConfigurationModule.configuration.spatialConfiguration.dbConfig
            .adm1DBPcode
        ] === site.admin1.pcode
    );
    if (admin1Feature.length > 0) {
      // eslint-disable-next-line
      const center = centroid(admin1Feature[0] as any);
      site.coordinates = {
        lng: center.geometry.coordinates[0],
        lat: center.geometry.coordinates[1]
      };
    }
  }

  return false;
}
