/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKBoundaries } from "./TKBoundaries";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";
import {
  PEOPLE_COUNT_ICON,
  SITE_COUNT_ICON,
  TKIndicator,
  TKIndicatorType
} from "./TKIndicator";
import { PEOPLE_COUNT_LABEL, SITE_COUNT_LABEL } from "./TKIndicatorLabels";

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSite } from "@/domain/survey/TKSite";
import { TKDateCompare, TKDateFormat } from "@/domain/utils/TKDate";
import {
  TKFDFIndicatorPeopleCount,
  TKFDFIndicators,
  TKFDFIndicatorSiteCount,
  TKFDFIndicatorStandard,
  TKFDFIndicatorType,
  TKFDFIndicatorValueCount
} from "../fdf/TKFDFIndicators";
import { TKSubmissionEntryType } from "./TKSubmissionEntry";
import { getCenterOfBounds } from "../map/TKMapSites";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSurveyAnonymousType {
  NONE = "none",
  TEXT = "text",
  TEXT_AND_MAP = "text and map"
}
export interface TKSurveyOptions {
  anonymousMode: TKSurveyAnonymousType;
  dateFormat: string;
  listSeparator: string;
}
// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurvey {
  name: string;
  boundaries: {
    admin1: TKBoundaries[];
    admin2: TKBoundaries[];
  };
  fdf: TKFDF;
  sites: TKSite[];
  options: TKSurveyOptions;
  computedIndicators: Record<string, [TKIndicator, TKIndicator, TKIndicator]>; // pcode -> string
  defaultIndicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr:
    | TKFDFIndicatorSiteCount
    | TKFDFIndicatorPeopleCount
    | TKFDFIndicatorValueCount
    | TKFDFIndicatorStandard,
  sites: TKSite[]
): TKIndicator {
  if (descr.type === TKFDFIndicatorType.SITE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: SITE_COUNT_LABEL,
      valueLabel: {
        en: String(sites.length)
      },
      iconOchaName: SITE_COUNT_ICON
    };
  }
  let foundAtLeastOnce = false;
  let thematicName = "";
  let itemIndex = -1;
  const results = [];
  for (const site of sites) {
    const submission = site.submissions[0];
    if (submission) {
      if (!foundAtLeastOnce) {
        for (const thematic in submission.thematics) {
          const them = submission.thematics[thematic];
          itemIndex = them.data.findIndex(
            item =>
              item.type === TKSubmissionEntryType.TEXT &&
              item.field === descr.entryCode
          );
          if (itemIndex > -1) {
            foundAtLeastOnce = true;
            thematicName = thematic;
            break;
          }
        }
      }

      if (
        foundAtLeastOnce &&
        submission.thematics &&
        submission.thematics[thematicName] &&
        submission.thematics[thematicName].data &&
        submission.thematics[thematicName].data[itemIndex]
      ) {
        const item = submission.thematics[thematicName].data[itemIndex];
        if (
          item &&
          item.type === TKSubmissionEntryType.TEXT &&
          item.answerLabel
        ) {
          results.push(item.answerLabel.en);
        }
      }
    }
  }

  let result = "-";
  if (foundAtLeastOnce) {
    if (
      descr.type === TKFDFIndicatorType.PEOPLE_COUNT ||
      descr.type === TKFDFIndicatorType.STANDARD
    ) {
      // Do the sum of numeric value
      result = String(
        results.reduce(
          (sum, current) =>
            sum +
            (!isNaN(parseFloat(current)) ? Math.floor(parseFloat(current)) : 0),
          0
        )
      );
    } else if (descr.type === TKFDFIndicatorType.VALUE_COUNT) {
      result = String(results.filter(item => item === descr.refValue).length);
    }
  }

  if (descr.type === TKFDFIndicatorType.PEOPLE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: PEOPLE_COUNT_LABEL,
      valueLabel: { en: result },
      iconOchaName: PEOPLE_COUNT_ICON
    };
  }

  return {
    type: TKIndicatorType.STANDARD,
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { en: result }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Survey Creation Method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSurvey(
  submissions: Record<string, string>[],
  fdf: TKFDF,
  languages: Array<string>,
  options: TKSurveyOptions
): TKSurvey {
  let sites: TKSite[] = [];

  const boundariesList: {
    admin1: TKBoundaries[];
    admin2: TKBoundaries[];
  } = {
    admin1: [],
    admin2: []
  };

  // Default bounds
  const DEFAULT_SITE_COORDINATES = getCenterOfBounds(
    TKConfigurationModule.configuration.spatialConfiguration.mapConfig.bounds
  );

  // Apply formatting to date item
  if (options.dateFormat) {
    submissions.map(submission => {
      submission[fdf.spatialDescription.siteLastUpdateField] = TKDateFormat(
        submission[fdf.spatialDescription.siteLastUpdateField],
        options.dateFormat
      );
    });
  }

  for (const submission of submissions) {
    const computedSubmission = TKCreateSubmission(
      submission,
      fdf,
      options,
      languages
    );

    // Check if new site
    let site = sites.find(
      site => site.id === submission[fdf.spatialDescription.siteIDField]
    );

    // Doesn't exist in sites list
    if (!site) {
      site = {
        id: submission[fdf.spatialDescription.siteIDField],
        name: submission[fdf.spatialDescription.siteNameField],
        type: fdf.siteTypes[submission[fdf.spatialDescription.siteTypeField]],
        admin1: {
          pcode: submission[fdf.spatialDescription.adm1Pcode],
          name: submission[fdf.spatialDescription.adm1Name]
        },
        admin2: {
          pcode: submission[fdf.spatialDescription.adm2Pcode],
          name: submission[fdf.spatialDescription.adm2Name]
        },

        managedBy: submission[fdf.spatialDescription.siteManageByField]
          ? fdf.answersLabels[
              submission[fdf.spatialDescription.siteManageByField]
            ] ?? { en: submission[fdf.spatialDescription.siteManageByField] }
          : fdf.spatialDescription.siteManageByAltValue &&
            submission[fdf.spatialDescription.siteManageByAltValue]
          ? fdf.answersLabels[
              submission[fdf.spatialDescription.siteManageByAltValue]
            ] ?? { en: submission[fdf.spatialDescription.siteManageByAltValue] }
          : { en: "-" },
        submissions: [computedSubmission],
        coordinates: {
          lat: DEFAULT_SITE_COORDINATES.lat,
          lng: DEFAULT_SITE_COORDINATES.lng
        }
      };

      // If not anonymisation, set lat long
      if (
        options.anonymousMode !== TKSurveyAnonymousType.TEXT_AND_MAP &&
        fdf.spatialDescription.siteLatitudeField &&
        fdf.spatialDescription.siteLongitudeField
      ) {
        site.coordinates = {
          lat: Number(
            submission[fdf.spatialDescription.siteLatitudeField].replace(
              ",",
              "."
            )
          ),
          lng: Number(
            submission[fdf.spatialDescription.siteLongitudeField].replace(
              ",",
              "."
            )
          )
        };
      }
      sites.push(site);

      // Add the admin2 if it doesn't exists
      if (
        !boundariesList.admin2
          .map(x => x.pcode)
          .includes(submission[fdf.spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[fdf.spatialDescription.adm2Pcode],
          name: submission[fdf.spatialDescription.adm2Name]
        });
      }

      // Add the admin1 if it doesn't exists
      if (
        !boundariesList.admin1
          .map(x => x.pcode)
          .includes(submission[fdf.spatialDescription.adm1Pcode])
      ) {
        boundariesList.admin1.push({
          pcode: submission[fdf.spatialDescription.adm1Pcode],
          name: submission[fdf.spatialDescription.adm1Name]
        });
      }
    }
    // Exist in sites list
    else {
      // Add the submissions
      site.submissions.push(computedSubmission);
    }
  }

  // Sort the dates and update last submission date for each site
  sites.map(site =>
    site.submissions.sort((a: TKSubmission, b: TKSubmission) => {
      return TKDateCompare(a.date, b.date);
    })
  );

  // //////////////////////////////////////////////////////////////////////////
  // Compute all indicators
  // //////////////////////////////////////////////////////////////////////////

  const computedIndicators: Record<
    string,
    [TKIndicator, TKIndicator, TKIndicator]
  > = {};

  // Root.
  computedIndicators[""] = [
    computeSurveyIndicator(fdf.indicators.home[0], sites),
    computeSurveyIndicator(fdf.indicators.home[1], sites),
    computeSurveyIndicator(fdf.indicators.home[2], sites)
  ];

  // All admin1.
  for (const admin1 of boundariesList.admin1) {
    const pcode = admin1.pcode;
    const sitesFiltered = sites.filter(site => site.admin1.pcode === pcode);
    computedIndicators[pcode] = [
      computeSurveyIndicator(fdf.indicators.home[0], sitesFiltered),
      computeSurveyIndicator(fdf.indicators.home[1], sitesFiltered),
      computeSurveyIndicator(fdf.indicators.home[2], sitesFiltered)
    ];
  }

  // All admin2.
  for (const admin2 of boundariesList.admin2) {
    const pcode = admin2.pcode;
    const sitesFiltered = sites.filter(site => site.admin2.pcode === pcode);
    computedIndicators[pcode] = [
      computeSurveyIndicator(fdf.indicators.home[0], sitesFiltered),
      computeSurveyIndicator(fdf.indicators.home[1], sitesFiltered),
      computeSurveyIndicator(fdf.indicators.home[2], sitesFiltered)
    ];
  }

  // //////////////////////////////////////////////////////////////////////////
  // Sort by alphabetical order
  // //////////////////////////////////////////////////////////////////////////

  sites = sites.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  boundariesList.admin1 = boundariesList.admin1.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  boundariesList.admin2 = boundariesList.admin2.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return {
    name: fdf.name,
    sites: sites,
    boundaries: boundariesList,
    computedIndicators: computedIndicators,
    defaultIndicators: fdf.indicators,
    fdf: fdf,
    options: options
  };
}
