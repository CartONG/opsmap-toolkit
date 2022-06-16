/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { TKDataset } from "@/domain/survey/TKDataset";

@Module({ dynamic: true, store, name: "TKDatasetModule" })
class TKDatasetModule extends VuexModule {
  _dataset: TKDataset = new TKDataset([]);
  _isDatasetInitialized: boolean = false;

  @Mutation
  setDataset(dataset: TKDataset) {
    this._dataset = dataset;
    this._isDatasetInitialized = true;
  }

  get dataset() {
    return this._dataset;
  }
  get isDatasetInitialized() {
    return this._isDatasetInitialized;
  }
}

export default getModule(TKDatasetModule);
