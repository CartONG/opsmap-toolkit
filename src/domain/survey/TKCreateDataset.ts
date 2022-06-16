// ////////////////////////////////////////////////////////////////////////////
// Create all the survey based on the surveys infos
// ////////////////////////////////////////////////////////////////////////////

import { TKFDFIndicators } from "@/domain/fdf/TKFDFIndicators";
import { TKFDFSpatialDescription } from "@/domain/fdf/TKFDFSpatialDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKCreateSurvey, TKSurvey } from "@/domain/survey/TKSurvey";
import { TKReadFDF } from "@/secondary/fdf/TKFDF";
import { TKReadRawDataset } from "@/secondary/survey/TKReadRawDataset";

export async function TKCreateDataset(
  surveyDescription: TKSurveyInfos[],
  spatialDescription: TKFDFSpatialDescription,
  indicators: TKFDFIndicators,
  languages: Array<string>
): Promise<TKDataset> {
  // prepare output
  const surveys: TKSurvey[] = [];

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    const before = Date.now();
    const rawData = await TKReadRawDataset(info);
    console.log(
      `Raw data ${info.name} retrieved in ${(Date.now() - before) /
        1000} seconds.`
    );

    const beforeFDF = Date.now();

    // Retrieve config
    const fdf = await TKReadFDF(info, indicators, spatialDescription);

    console.log(
      `FDF  ${info.name} retrieved in ${(Date.now() - beforeFDF) /
        1000} seconds.`
    );

    const beforeSurvey = Date.now();

    // Create survey
    surveys.push(TKCreateSurvey(rawData, fdf, languages, info.options));

    console.log(
      `Survey  ${info.name} computed in ${(Date.now() - beforeSurvey) /
        1000} seconds.`
    );
  }
  return new TKDataset(surveys);
}
