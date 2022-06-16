/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKBoundaries } from "./TKBoundaries";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";
import {
  PEOPLE_COUNT_ICON,
  PEOPLE_COUNT_LABEL,
  SITE_COUNT_ICON,
  SITE_COUNT_LABEL,
  TKIndicator,
  TKIndicatorType
} from "./TKIndicator";
import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKCamp } from "@/domain/survey/TKCamp";
import { TKDateCompare, TKDateFormat } from "@/domain/utils/TKDate";
import {
  TKFDFIndicatorPeopleCount,
  TKFDFIndicatorSiteCount,
  TKFDFIndicatorStandard,
  TKFDFIndicatorType,
  TKFDFIndicatorValueCount
} from "../fdf/TKFDFIndicators";
import { TKSubmissionEntryType } from "./TKSubmissionEntry";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyOptions {
  dateFormat: string;
  manageByField: string;
  manageByAltValue?: string;
  listSeparator: string;
}

export interface TKSurvey {
  name: string;
  boundaries: {
    admin1: TKBoundaries[];
    admin2: TKBoundaries[];
  };
  fdf: TKFDF;
  camps: TKCamp[];
  options: TKSurveyOptions;
  indicators: Record<string, [TKIndicator, TKIndicator, TKIndicator]>; // pcode -> string
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
  camps: TKCamp[]
): TKIndicator {
  if (descr.type === TKFDFIndicatorType.SITE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: SITE_COUNT_LABEL,
      valueLabel: {
        en: String(camps.length)
      },
      iconOchaName: SITE_COUNT_ICON
    };
  }
  let foundAtLeastOnce = false;
  let thematicName = "";
  let itemIndex = -1;
  const results = [];
  for (const camp of camps) {
    const submission = camp.submissions[0];
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
  let camps: TKCamp[] = [];

  const boundariesList: {
    admin1: TKBoundaries[];
    admin2: TKBoundaries[];
  } = {
    admin1: [],
    admin2: []
  };

  submissions.map(submission => {
    submission[fdf.spatialDescription.siteLastUpdateField] = TKDateFormat(
      submission[fdf.spatialDescription.siteLastUpdateField],
      options.dateFormat
    );
  });

  for (const submission of submissions) {
    const computedSubmission = TKCreateSubmission(
      submission,
      fdf,
      options,
      languages
    );

    // Check if new camp
    let camp = camps.find(
      camp => camp.id === submission[fdf.spatialDescription.siteIDField]
    );

    // Doesn't exist in camps list
    if (!camp) {
      camp = {
        id: submission[fdf.spatialDescription.siteIDField],
        name: submission[fdf.spatialDescription.siteNameField],
        type: fdf.siteTypes[submission[fdf.spatialDescription.siteTypeField]],
        lat: Number(
          submission[fdf.spatialDescription.siteLatitudeField].replace(",", ".")
        ),
        lng: Number(
          submission[fdf.spatialDescription.siteLongitudeField].replace(
            ",",
            "."
          )
        ),
        admin1: {
          pcode: submission[fdf.spatialDescription.adm1Pcode],
          name: submission[fdf.spatialDescription.adm1Name]
        },
        admin2: {
          pcode: submission[fdf.spatialDescription.adm2Pcode],
          name: submission[fdf.spatialDescription.adm2Name]
        },
        admin3: {
          pcode: submission[fdf.spatialDescription.adm3Pcode],
          name: submission[fdf.spatialDescription.adm3Name]
        },
        managedBy: {
          en: submission[options.manageByField]
            ? submission[options.manageByField]
            : options.manageByAltValue
            ? options.manageByAltValue
            : "-"
        },
        submissions: [computedSubmission]
      };
      camps.push(camp);

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
    // Exist in camps list
    else {
      // Add the submissions
      camp.submissions.push(computedSubmission);
    }
  }

  // Sort the dates and update last submission date for each camp
  camps.map(camp =>
    camp.submissions.sort((a: TKSubmission, b: TKSubmission) => {
      return TKDateCompare(a.date, b.date);
    })
  );

  // //////////////////////////////////////////////////////////////////////////
  // Compute all indicators
  // //////////////////////////////////////////////////////////////////////////

  const indicators: Record<
    string,
    [TKIndicator, TKIndicator, TKIndicator]
  > = {};

  // Root.
  indicators[""] = [
    computeSurveyIndicator(fdf.indicators.home[0], camps),
    computeSurveyIndicator(fdf.indicators.home[1], camps),
    computeSurveyIndicator(fdf.indicators.home[2], camps)
  ];

  // All admin1.
  for (const admin1 of boundariesList.admin1) {
    const pcode = admin1.pcode;
    const campsFiltered = camps.filter(camp => camp.admin1.pcode === pcode);
    indicators[pcode] = [
      computeSurveyIndicator(fdf.indicators.home[0], campsFiltered),
      computeSurveyIndicator(fdf.indicators.home[1], campsFiltered),
      computeSurveyIndicator(fdf.indicators.home[2], campsFiltered)
    ];
  }

  // All admin2.
  for (const admin2 of boundariesList.admin2) {
    const pcode = admin2.pcode;
    const campsFiltered = camps.filter(camp => camp.admin2.pcode === pcode);
    indicators[pcode] = [
      computeSurveyIndicator(fdf.indicators.home[0], campsFiltered),
      computeSurveyIndicator(fdf.indicators.home[1], campsFiltered),
      computeSurveyIndicator(fdf.indicators.home[2], campsFiltered)
    ];
  }

  // //////////////////////////////////////////////////////////////////////////
  // Sort by alphabetical order
  // //////////////////////////////////////////////////////////////////////////

  camps = camps.sort((a, b) => {
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
    camps: camps,
    boundaries: boundariesList,
    indicators: indicators,
    fdf: fdf,
    options: options
  };
}
