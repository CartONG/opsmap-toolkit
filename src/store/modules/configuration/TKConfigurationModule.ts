import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { TKOpsmapConfiguration } from "@/domain";

@Module({ dynamic: true, store, name: "TKConfigurationModule" })
class TKConfigurationModule extends VuexModule {
  _configuration!: TKOpsmapConfiguration;

  @Mutation
  setConfiguration(config: TKOpsmapConfiguration) {
    this._configuration = config;
  }

  get configuration(): TKOpsmapConfiguration {
    return this._configuration;
  }
}

export default getModule(TKConfigurationModule);
