import { TKLabel } from "@/domain/utils/TKLabel";
import { TKLogoGroup } from "@/domain/utils/TKLogo";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKLogo } from "@/domain/utils/TKLogo";
import VueI18n from "vue-i18n";
import {
  TKSurveyAnonymousType,
  TKSurveyOptions
} from "@/domain/survey/TKSurvey";

// ////////////////////////////////////////////////////////////////////////////
// JSON format
// ////////////////////////////////////////////////////////////////////////////
interface TKAppOptions {
  readonly showCCCMLogo: boolean;
  readonly dark: boolean;
  readonly pdfColumnCount: number;
  readonly exportForEsite: boolean;
  readonly showDemoBanner: boolean;
  readonly exportAsCSVonHomePage: boolean;
  readonly keepThematicOrderFromFDF: boolean;
}
interface TKIFrameDescription {
  readonly url: string;
  readonly display: boolean;
}

interface TKMapboxConfiguration {
  readonly token: string;
  readonly style: string;
  readonly padding: 100;
  readonly zoomspeed: 2;
  readonly bounds: Array<number>;
}

export interface TKOpsmapSpatialConfiguration {
  mapConfig: TKMapboxConfiguration;
  dbConfig: {
    adm1DBPcode: string;
    adm2DBPcode: string;
  };
  localFiles: {
    admin0LocalURL: string;
  };
}

// ////////////////////////////////////////////////////////////////////////////
// This file host some infos that could be in the FDF.
// Therefore, specific FDF types are used
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////

export interface TKOpsmapConfiguration {
  readonly name: TKLabel;
  title: TKLabel;
  readonly languages: string[];
  languageDefault: string;
  readonly iso3: string;
  readonly opsmapDescr: TKLabel;
  readonly spatialConfiguration: TKOpsmapSpatialConfiguration;
  readonly footerLogos: TKLogoGroup[];
  readonly iframe?: TKIFrameDescription;
  readonly surveys: TKSurveyInfos[];
  headerLogos: TKLogo[];
  options: TKAppOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from JSON file
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadGeneralConfiguration(
  configFileName: string,
  translations: VueI18n.LocaleMessages
): Promise<TKOpsmapConfiguration> {
  const json: TKOpsmapConfiguration = await fetch(
    configFileName
  ).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Languages
  // Always has english, is never empty.
  if (!json.languages.includes("en")) {
    json.languages.push("en");
  }

  json.languageDefault = json.languageDefault ?? "en";

  // ////////////////////////////////////////////////////////////////////////////
  // Update urlLogo
  // Could be improved
  // Webdev is not modified, because it isn't a local url.

  // TODO UPDATE ALL OF THIS
  for (const logo of json.headerLogos) {
    logo.urlLogo = `${process.env.BASE_URL}/${logo.urlLogo}`;
  }

  // TODO UPDATE ALL OF THIS
  for (const descr of json.footerLogos) {
    for (const logo of descr.logos) {
      logo.urlLogo = `${process.env.BASE_URL}/${logo.urlLogo}`;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Mapbox configuration - handle default values
  // ////////////////////////////////////////////////////////////////////////////

  const title: TKLabel = {};
  json.languages.map(locale => {
    title[locale] = translations[locale]["appName"].toString();
  });

  json.title = {
    ...title,
    ...json.title
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Mapbox configuration - handle default values
  // ////////////////////////////////////////////////////////////////////////////
  // Provide defaults values to mapbox config
  // UNHCR account
  // token: "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
  // style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4",

  // OPSMAP account
  // token: "pk.eyJ1Ijoib3BzbWFwcGVyIiwiYSI6ImNrbW5xMWFuYzBqejMydnBnN2VjMTBj;cG8ifQ.OtWWd9kzJdJjogrY7gb-sw",
  // style: "mapbox://styles/opsmapper/ckmnq4jfb12r217o7yon9r383",

  const defaultMapBoxConfig: TKMapboxConfiguration = {
    token:
      "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
    style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4",
    padding: 100,
    zoomspeed: 2,
    bounds: [-74.17, -33.34, -33.57, 5.02]
  };

  // Init with defaultMApBoxConfig, then replace existing key with mapConfig.
  // Order matter !
  json.spatialConfiguration.mapConfig = {
    ...defaultMapBoxConfig,
    ...json.spatialConfiguration.mapConfig
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Header Logo
  // ////////////////////////////////////////////////////////////////////////////
  const defaultHeaderLogo: TKLogo[] = [];

  json.headerLogos = {
    ...defaultHeaderLogo,
    ...json.headerLogos
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Options
  // ////////////////////////////////////////////////////////////////////////////

  const defaultAppOptions: TKAppOptions = {
    showCCCMLogo: true,
    dark: false,
    pdfColumnCount: 3,
    exportForEsite: false,
    showDemoBanner: false,
    exportAsCSVonHomePage: false,
    keepThematicOrderFromFDF: false
  };

  // Init with defaultOptions, then replace existing key with options.
  // Order matter !
  json.options = {
    ...defaultAppOptions,
    ...json.options
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Survey Options
  // ////////////////////////////////////////////////////////////////////////////

  // TODO: move manage by in another spot. Not an otion, more a description
  const defaultSurveyOptions: TKSurveyOptions = {
    dateFormat: "DD/MM/YYYY",
    listSeparator: ";",
    anonymousMode: TKSurveyAnonymousType.NONE
  };

  for (let i = 0; i < json.surveys.length; i++) {
    json.surveys[i].options = {
      ...defaultSurveyOptions,
      ...json.surveys[i].options
    };

    // Force to global if lat or long are undefined
    if (
      !json.surveys[i].spatial.siteLatitudeField ||
      !json.surveys[i].spatial.siteLongitudeField
    ) {
      json.surveys[i].options.anonymousMode =
        TKSurveyAnonymousType.TEXT_AND_MAP;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Return final json
  // ////////////////////////////////////////////////////////////////////////////

  console.log(json);

  return json;
}
