import { FeatureCollection } from "geojson";
import { TKCamp } from "@/domain/survey/TKCamp";
interface TKFilteredCamps {
  selectedCamp: FeatureCollection | string;
  otherCamps: FeatureCollection;
}

export class TKMapCamps {
  public filteredCamps: TKFilteredCamps;

  constructor(private camps: TKCamp[], private currentCamp: TKCamp | null) {
    this.camps = camps;
    this.currentCamp = currentCamp;
    this.filteredCamps = this.filterCamps();
  }

  toGeoJSON(campsArray: TKCamp[]): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: campsArray.map((camp: TKCamp) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [camp.infos.lng, camp.infos.lat]
          },
          properties: {
            id: camp.infos.id,
            name: camp.infos.name,
            type: camp.infos.type,
            lastSubmission: camp.submissions[0].date,
            lat: camp.infos.lat,
            lng: camp.infos.lng,
            admin1: camp.infos.admin1,
            admin2: camp.infos.admin2,
            admin3: camp.infos.admin3
          }
        };
      })
    };
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter(camp => camp.infos.id === this.currentCamp?.infos.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp
          ? this.camps.filter(
              camp => camp.infos.id !== this.currentCamp?.infos.id
            )
          : this.camps
      )
    };
  }
}
