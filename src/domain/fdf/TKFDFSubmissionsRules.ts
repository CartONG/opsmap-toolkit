// ////////////////////////////////////////////////////////////////////////////
// Submission rules datatype
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFSubmissionItemType {
  STRING = "string",
  INTEGER = "integer",
  LIST = "list",
  BULLET = "bullet",
  DATE = "date",
  COMPUTED = "computed"
}
export interface TKFDFSubmissionRule {
  fieldName: string;
  type: TKFDFSubmissionItemType;
  thematicGroup: string;
  trafficLightName: string;
  chartId: string;
  chartData: string;
  displayCondition?: {
    field: string;
    operator: string;
    value: string;
  };
  computed?: {
    field1: string;
    operator: string;
    field2: string;
  };
}

export interface TKFDFSubmissionsRulesCollection {
  [propName: string]: TKFDFSubmissionRule;
}
