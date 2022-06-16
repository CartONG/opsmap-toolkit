// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKFDFIndicators } from "@/domain/fdf/TKFDFIndicators";
import { TKFDFSpatialDescription } from "@/domain/fdf/TKFDFSpatialDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFFiles } from "@/secondary/fdf/TKFDFInfos";
import {
  TKReadFDFLabelCollection,
  TKReadFDFLabelCollectionFromGSheet
} from "@/secondary/fdf/TKFDFParseMultiLang";
import { TKReadSubmissionsRulesCollection } from "@/secondary/fdf/TKFDFSubmissionsRules";
import { TKReadFDFTerminologyCollection } from "@/secondary/fdf/TKFDFTerminology";
import { TKReadFDFThematicsCollection } from "@/secondary/fdf/TKFDFThematics";
import { TKReadFDFTrafficLightsCollection } from "@/secondary/fdf/TKFDFTrafficLight";
import { TKReadFDFURLsCollection } from "@/secondary/fdf/TKFDFURLs";
import { TKReadFDFSiteTypesCollection } from "./TKFDFSiteTypes";

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the FDF object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////
export async function TKReadFDF(
  infos: TKSurveyInfos,
  indicators: TKFDFIndicators,
  spatialDescription: TKFDFSpatialDescription
): Promise<TKFDF> {
  let answersLabels = {};
  if (infos.type === "gsheet") {
    answersLabels = await TKReadFDFLabelCollectionFromGSheet(
      infos.submissionsTrUrl
    );
  } else {
    answersLabels = await TKReadFDFLabelCollection(
      TKFDFFiles.ANSWERS,
      infos.fdf
    );
  }

  return {
    name: infos.name,
    terminology: await TKReadFDFTerminologyCollection(infos.fdf),
    thematics: await TKReadFDFThematicsCollection(infos.fdf),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos.fdf),
    fieldsLabels: await TKReadFDFLabelCollection(TKFDFFiles.FIELDS, infos.fdf),
    answersLabels: answersLabels,
    submissionsRules: await TKReadSubmissionsRulesCollection(infos.fdf),
    urls: await TKReadFDFURLsCollection(infos.fdf),
    indicators: indicators,
    spatialDescription: spatialDescription,
    siteTypes: await TKReadFDFSiteTypesCollection(infos.fdf)
  };
}
