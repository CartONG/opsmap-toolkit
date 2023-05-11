import { TKFDFInfos } from "../fdf/TKFDFInfos";
import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKSurveyOptions } from "../survey/TKSurvey";
import { TKFDFIndicators } from "../fdf/TKFDFIndicators";

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
  options: TKSurveyOptions;
  readonly spatial: TKFDFSpatialDescription;
  readonly indicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosCSV {
  readonly type: TKSurveyInfosType.CSV;
  readonly name: string;
  readonly fdf: TKFDFInfos;
  readonly submissionsLocalUrl: string;
  readonly submissionsTrLocalUrl: string;
  options: TKSurveyOptions;
  readonly spatial: TKFDFSpatialDescription;
  readonly indicators: TKFDFIndicators;
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
  options: TKSurveyOptions;
  readonly spatial: TKFDFSpatialDescription;
  readonly indicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSurveyInfos =
  | TKSurveyInfosKobo
  | TKSurveyInfosGSheet
  | TKSurveyInfosCSV;
