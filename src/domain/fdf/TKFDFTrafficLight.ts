import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";

// ////////////////////////////////////////////////////////////////////////////
// TrafficLights collection datatype
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFTrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list",
  NOTINLIST = "notnone"
}
interface TKFDFTrafficLightItem {
  traffic_light_name: string;
  type: TKFDFTrafficLightTypes;
  value: string;
  color: TKTrafficLightValues;
}

export interface TKFDFTrafficLightGrouped {
  type: TKFDFTrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightValues;
    }
  ];
}

export interface TKFDFTrafficLightsCollection {
  [propName: string]: TKFDFTrafficLightGrouped;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the TrafficLightscollection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFTrafficLightsCollection(
  infos: TKFDFInfos
): Promise<TKFDFTrafficLightsCollection> {
  const rawTrafficLights: TKFDFTrafficLightItem[] = await TKCSVRead<
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
