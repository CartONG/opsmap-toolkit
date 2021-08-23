import { TKSurveyInfosGSheet } from "../opsmapConfig/TKSurveyInfos";
import { TKGSheetRead } from "./TKGSheetReader";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from csv
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetGSheetRawData(survey: TKSurveyInfosGSheet) {
  const csvData = await TKGSheetRead(survey.submissionsUrl, true);
  return csvData;
}
