import { TKFDFFiles } from "@/secondary/fdf/TKFDFInfos";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import {
  TKFDFTrafficLightsCollection,
  TKFDFTrafficLightTypes
} from "@/domain/fdf/TKFDFTrafficLight";
import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
import { TKCSVParse } from "@/secondary/csv/TKCSV";

// ////////////////////////////////////////////////////////////////////////////
// TrafficLights collection datatype
// ////////////////////////////////////////////////////////////////////////////

interface TKFDFTrafficLightItem {
  traffic_light_name: string;
  type: TKFDFTrafficLightTypes;
  value: string;
  color: TKTrafficLightValues;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the TrafficLightscollection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFTrafficLightsCollection(
  infos: TKFDFInfos
): Promise<TKFDFTrafficLightsCollection> {
  const rawTrafficLights: TKFDFTrafficLightItem[] = await TKCSVParse<
    TKFDFTrafficLightItem[]
  >(TKFDFFiles.TRAFFIC_LIGHTS, infos.folder, true);

  const trafficLights: TKFDFTrafficLightsCollection = {};

  for (const item of rawTrafficLights) {
    if (trafficLights[item.traffic_light_name]) {
      trafficLights[item.traffic_light_name].values.push({
        value: item.value,
        color: item.color
      });
    } else {
      trafficLights[item.traffic_light_name] = {
        type: item.type,
        values: [
          {
            value: item.value,
            color: item.color
          }
        ]
      };
    }
  }
  return trafficLights;
}
