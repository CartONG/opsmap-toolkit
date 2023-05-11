import {
  TKSurveyInfos,
  TKSurveyInfosType
} from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";

export async function TKReadRawDataset(info: TKSurveyInfos) {
  if (info.type === TKSurveyInfosType.CSV) {
    return TKCSVParse(
      `${process.env.BASE_URL}/${info.submissionsLocalUrl}`,
      true
    );
    info;
  } else if (info.type === TKSurveyInfosType.GSHEET) {
    return TKCSVParse(info.submissionsUrl, true);
  } else if (info.type === TKSurveyInfosType.KOBO) {
    return TKGetKoboRawData(info);
  }
}
