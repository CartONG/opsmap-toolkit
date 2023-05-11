// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFFiles } from "@/secondary/fdf/TKFDFInfos";
import { TKReadFDFLabelCollection } from "@/secondary/fdf/TKFDFParseMultiLang";
import { TKReadSubmissionsRulesCollection } from "@/secondary/fdf/TKFDFSubmissionsRules";
import { TKReadFDFTerminologyCollection } from "@/secondary/fdf/TKFDFTerminology";
import { TKReadFDFThematicsCollection } from "@/secondary/fdf/TKFDFThematics";
import { TKReadFDFTrafficLightsCollection } from "@/secondary/fdf/TKFDFTrafficLight";
import { TKReadFDFURLsCollection } from "@/secondary/fdf/TKFDFURLs";
import { TKReadFDFSiteTypesCollection } from "./TKFDFSiteTypes";

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the FDF object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////
export async function TKReadFDF(infos: TKSurveyInfos): Promise<TKFDF> {
  let answersLabels = {};
  switch (infos.type) {
    case "gsheet":
      answersLabels = await TKReadFDFLabelCollection(infos.submissionsTrUrl);
      break;
    case "csv":
      answersLabels = await TKReadFDFLabelCollection(
        `${process.env.BASE_URL}/${infos.submissionsTrLocalUrl}`
      );
      break;
    case "kobo":
      answersLabels = await TKReadFDFLabelCollection(
        `${process.env.BASE_URL}/${infos.fdf.folder}/${TKFDFFiles.ANSWERS}.csv`
      );
  }

  return {
    name: infos.name,
    terminology: await TKReadFDFTerminologyCollection(infos.fdf),
    thematics: await TKReadFDFThematicsCollection(infos.fdf),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos.fdf),
    fieldsLabels: await TKReadFDFLabelCollection(
      `${process.env.BASE_URL}/${infos.fdf.folder}/${TKFDFFiles.FIELDS}.csv`
    ),
    answersLabels: answersLabels,
    submissionsRules: await TKReadSubmissionsRulesCollection(infos.fdf),
    urls: await TKReadFDFURLsCollection(infos.fdf),
    indicators: infos.indicators,
    spatialDescription: infos.spatial,
    siteTypes: await TKReadFDFSiteTypesCollection(infos.fdf)
  };
}
