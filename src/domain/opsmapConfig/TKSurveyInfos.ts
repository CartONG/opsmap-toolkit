import { TKFDFInfos } from "../fdf/TKFDFInfos";
import { TKSurveyOptions } from "../survey/TKSurvey";

export enum TKSurveyInfosType {
  KOBO = "kobo",
  CSV = "csv",
  GSHEET = "gsheet"
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for KOBO Inputs
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurveyInfosKobo {
  readonly type: TKSurveyInfosType.KOBO;
  readonly name: string;
  readonly fdf: TKFDFInfos;
  readonly url: string;
  readonly token: string;
  readonly options: TKSurveyOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosCSV {
  readonly type: TKSurveyInfosType.CSV;
  readonly name: string;
  readonly fdf: TKFDFInfos;
  readonly submissionsFolder: string;
  readonly submissionsFile: string;
  readonly options: TKSurveyOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosGSheet {
  readonly type: TKSurveyInfosType.GSHEET;
  readonly name: string;
  readonly fdf: TKFDFInfos;
  readonly submissionsUrl: string;
  readonly submissionsTrUrl: string;
  readonly options: TKSurveyOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSurveyInfos =
  | TKSurveyInfosKobo
  | TKSurveyInfosGSheet
  | TKSurveyInfosCSV;
