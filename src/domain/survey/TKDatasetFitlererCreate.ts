// ////////////////////////////////////////////////////////////////////////////
// Create all the survey based on the surveys infos
// ////////////////////////////////////////////////////////////////////////////

import { TKGetCSVRawData } from "../csv/TKGetCSVRawData";
import { TKCreateFDF } from "../fdf/TKFDF";
import { TKGetGSheetRawData } from "../gsheet/TKGetGSheetRawData";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";
import { TKIndicatorsDescription } from "../opsmapConfig/TKIndicatorsDescription";
import { TKSpatialDescription } from "../opsmapConfig/TKSpatialDescription";
import { TKSurveyInfos } from "../opsmapConfig/TKSurveyInfos";
import { TKDatasetFilterer } from "./TKDatasetFilterer";
import { TKCreateSurvey, TKSurvey } from "./TKSurvey";

export async function TKDatasetFitlererCreate(
  surveyDescription: TKSurveyInfos[],
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription,
  languages: Array<string>
): Promise<TKDatasetFilterer> {
  // prepare output
  const surveys: TKSurvey[] = [];

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    const before = Date.now();
    if (info.type === "csv") {
      rawData = await TKGetCSVRawData(info);
    } else if (info.type === "gsheet") {
      rawData = await TKGetGSheetRawData(info);
    } else if (info.type === "kobo") {
      rawData = await TKGetKoboRawData(info);
    }
    console.log(
      `Raw data ${info.name} retrieved in ${(Date.now() - before) /
        1000} seconds.`
    );

    const beforeFDF = Date.now();

    // Retrieve config
    const surveyConfig = await TKCreateFDF(info);

    console.log(
      `FDF  ${info.name} retrieved in ${(Date.now() - beforeFDF) /
        1000} seconds.`
    );

    const beforeSurvey = Date.now();

    // Create survey
    surveys.push(
      TKCreateSurvey(
        rawData,
        surveyConfig,
        spatialDescription,
        indicatorsDescription,
        languages,
        info.options
      )
    );

    console.log(
      `Survey  ${info.name} computed in ${(Date.now() - beforeSurvey) /
        1000} seconds.`
    );
  }
  return new TKDatasetFilterer(surveys);
}
