import { TKFDFInfos } from "../fdf/TKFDFInfos";
import { TKSurveyOptions } from "../survey/TKSurvey";

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for KOBO Inputs
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurveyInfosKobo {
  readonly type: "kobo";
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
  readonly type: "csv";
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
  readonly type: "gsheet";
  readonly name: string;
  readonly fdf: TKFDFInfos;
  readonly submissionsUrl: string;
  readonly submissionsTrUrl: string;
  readonly options: TKSurveyOptions;
}

// folder: string;

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSurveyInfos =
  | TKSurveyInfosKobo
  | TKSurveyInfosGSheet
  | TKSurveyInfosCSV;
