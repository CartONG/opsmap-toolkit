import { Module, VuexModule, getModule } from "vuex-module-decorators";
import store from "@/store";
import TKConfigurationModule from "../configuration/TKConfigurationModule";

@Module({ dynamic: true, store, name: "TKPDFInfosModule" })
class TKPDFInfosModule extends VuexModule {
  _currentChartsBase64: Record<string, string> = {};

  get currentChartsBase64() {
    return this._currentChartsBase64;
  }

  get columnCount() {
    return TKConfigurationModule.configuration.options.pdfColumnCount;
  }
}

export default getModule(TKPDFInfosModule);
