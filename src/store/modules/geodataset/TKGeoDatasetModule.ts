import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";

@Module({ dynamic: true, store, name: "TKGeoDatasetModule" })
class TKGeoDatasetModule extends VuexModule {
  _geoDataset: TKGeoDataset = {
    admin1: {
      type: "FeatureCollection",
      features: []
    },
    admin2: {
      type: "FeatureCollection",
      features: []
    }
  };

  @Mutation
  setGeoDataset(geoDataset: TKGeoDataset) {
    this._geoDataset = geoDataset;
  }

  get geoDataset() {
    return this._geoDataset;
  }
}

export default getModule(TKGeoDatasetModule);
