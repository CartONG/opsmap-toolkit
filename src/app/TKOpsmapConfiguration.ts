import { TKMapboxConfiguration } from "@/domain/opsmapConfig/TKMapboxConfiguration";
import { TKLabel } from "@/domain/ui/TKLabel";
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogosDescription";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKAppOptions } from "@/domain/opsmapConfig/TKAppOptions";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKIFrameDescription } from "@/domain/opsmapConfig/TKIFrameDescription";

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////
export interface TKOpsmapConfiguration {
  readonly name: TKLabel;
  readonly languages: string[];
  readonly iso3: string;
  readonly opsmapDescr: TKLabel;
  readonly indicators: TKIndicatorsDescription;
  readonly footerLogos: TKFooterLogosDescription[];
  readonly iframe?: TKIFrameDescription;
  readonly surveys: TKSurveyInfos[];
  readonly spatial: TKSpatialDescription;
  headerLogos: TKLogo[];
  mapConfig: TKMapboxConfiguration;
  options: TKAppOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from JSON file
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadGeneralConfiguration(
  configFileName: string
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
  const defaultOptions: TKAppOptions = {
    showCCCMLogo: true,
    pdfColumnCount: 3
  };

  // Init with defaultOptions, then replace existing key with options.
  // Order matter !
  json.options = {
    ...defaultOptions,
    ...json.options
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Return final json
  // ////////////////////////////////////////////////////////////////////////////

  console.log(json);

  return json;
}
