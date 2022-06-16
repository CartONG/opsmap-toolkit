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
            coordinates: [camp.lng, camp.lat]
          },
          properties: {
            id: camp.id,
            name: camp.name,
            type: camp.type.formattedName,
            lastSubmission: camp.submissions[0].date,
            lat: camp.lat,
            lng: camp.lng,
            admin1: camp.admin1,
            admin2: camp.admin2,
            admin3: camp.admin3
          }
        };
      })
    };
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter(camp => camp.id === this.currentCamp?.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp
          ? this.camps.filter(camp => camp.id !== this.currentCamp?.id)
          : this.camps
      )
    };
  }
}
