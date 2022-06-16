// ////////////////////////////////////////////////////////////////////////////
// TrafficLights collection datatype
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFTrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list",
  NOTINLIST = "notnone"
}

export enum TKTrafficLightValues {
  OK = "green",
  WARNING = "yellow",
  DANGER = "orange",
  CRITICAL = "red",
  UNDEFINED = "purple"
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
