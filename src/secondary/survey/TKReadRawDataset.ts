import {
  TKSurveyInfos,
  TKSurveyInfosType
} from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import { TKReadRawDataGSheet } from "../gsheet/TKReadRawDataGSheet";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";

export async function TKReadRawDataset(info: TKSurveyInfos) {
  if (info.type === TKSurveyInfosType.CSV) {
    return TKCSVParse(info.submissionsFile, info.submissionsFolder, true);
    info;
  } else if (info.type === TKSurveyInfosType.GSHEET) {
    return TKReadRawDataGSheet(info.submissionsUrl, true);
  } else if (info.type === TKSurveyInfosType.KOBO) {
    return TKGetKoboRawData(info);
  }
}
