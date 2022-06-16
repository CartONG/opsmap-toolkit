// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey

import { TKFDFIndicators } from "./TKFDFIndicators";
import { TKFDFLabelCollection } from "./TKFDFParseMultiLang";
import { TKFDFSpatialDescription } from "./TKFDFSpatialDescription";
import { TKFDFSubmissionsRulesCollection } from "./TKFDFSubmissionsRules";
import { TKFDFSiteTypeCollection } from "./TKFDFSiteTypes";
import { TKFDFTerminologyCollection } from "./TKFDFTerminology";
import { TKTFDFhematicsCollection } from "./TKFDFThematics";
import { TKFDFTrafficLightsCollection } from "./TKFDFTrafficLight";

import { TKFDFUrlsCollection } from "./TKFDFURLs";

// ////////////////////////////////////////////////////////////////////////////
export interface TKFDF {
  name: string;
  terminology: TKFDFTerminologyCollection;
  thematics: TKTFDFhematicsCollection;
  trafficLights: TKFDFTrafficLightsCollection;
  fieldsLabels: TKFDFLabelCollection;
  answersLabels: TKFDFLabelCollection;
  submissionsRules: TKFDFSubmissionsRulesCollection;
  urls: TKFDFUrlsCollection;
  indicators: TKFDFIndicators;
  spatialDescription: TKFDFSpatialDescription;
  siteTypes: TKFDFSiteTypeCollection;
}
