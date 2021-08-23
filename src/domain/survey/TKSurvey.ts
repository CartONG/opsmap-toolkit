/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKCampTypesValues } from "./TKCamp";
import { TKBoundariesCollection } from "./TKBoundariesCollection";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";
import { TKIndicator } from "../ui/TKIndicator";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKIndicatorsDescription,
  TKIndicatorDescription
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import moment from "moment";
import { isNumber } from "@turf/turf";
import { TKCamp } from "@/domain/survey/TKCamp";
import { TKDateCompare } from "../ui/TKDateCompare";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyOptions {
  dateFormat: string;
  manageByField: string;
  manageByAltValue?: string;
}

export interface TKSurvey {
  name: string;
  boundariesList: TKBoundariesCollection;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
  fdf: TKFDF;
  camps: TKCamp[];
  options: TKSurveyOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// sort dates
// ////////////////////////////////////////////////////////////////////////////

function formatDate(date: string, options: TKSurveyOptions): string {
  if (options.dateFormat) {
    const day = moment(date, options.dateFormat);
    return day.format("DD/MM/YYYY");
  }

  return date;
}

// ////////////////////////////////////////////////////////////////////////////
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr: TKIndicatorDescription,
  camps: TKCamp[]
): TKIndicator {
  if (descr.entryCode === "mp_site_id") {
    return {
      type: descr.type,
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: {
        en: String(camps.length)
      }
    };
  }

  let foundAtLeastOnce = false;
  let thematicName = "";
  let itemIndex = -1;
  let sum = 0;

  for (const camp of camps) {
    const submission = camp.submissions[0];
    if (submission) {
      if (!foundAtLeastOnce) {
        for (const thematic in submission.thematics) {
          const them = submission.thematics[thematic];
          itemIndex = them.data.findIndex(
            item => item.type === "text" && item.field === descr.entryCode
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
          item.type === "text" &&
          item.answerLabel &&
          isNumber(item.answerLabel.en)
        ) {
          sum += Number(item.answerLabel.en);
        }
      }
    }
  }
  if (!foundAtLeastOnce) {
    return {
      type: descr.type,
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: { en: "-" }
    };
  }

  return {
    type: descr.type,
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { en: String(sum) }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Survey Creation Method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSurvey(
  submissions: Record<string, string>[],
  surveyConfig: TKFDF,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription,
  languages: Array<string>,
  options: TKSurveyOptions
): TKSurvey {
  const camps: TKCamp[] = [];

  const boundariesList: TKBoundariesCollection = {
    admin1: [],
    admin2: []
  };

  submissions.map(submission => {
    submission[spatialDescription.siteLastUpdateField] = formatDate(
      submission[spatialDescription.siteLastUpdateField],
      options
    );
  });

  for (const submission of submissions) {
    const computedSubmission = TKCreateSubmission(
      submission,
      surveyConfig,
      indicatorsDescription,
      spatialDescription,
      languages
    );

    // Check if new camp
    let camp = camps.find(
      camp => camp.infos.id === submission[spatialDescription.siteIDField]
    );

    // Doesn't exist in camps list
    if (!camp) {
      camp = {
        infos: {
          id: submission[spatialDescription.siteIDField],
          name: submission[spatialDescription.siteNameField],
          type: surveyConfig.terminology[
            submission[spatialDescription.siteTypeField]
          ] as TKCampTypesValues,
          lat: Number(
            submission[spatialDescription.siteLatitudeField].replace(",", ".")
          ),
          lng: Number(
            submission[spatialDescription.siteLongitudeField].replace(",", ".")
          ),
          admin1: {
            pcode: submission[spatialDescription.adm1Pcode],
            name: submission[spatialDescription.adm1Name]
          },
          admin2: {
            pcode: submission[spatialDescription.adm2Pcode],
            name: submission[spatialDescription.adm2Name]
          },
          admin3: {
            pcode: submission[spatialDescription.adm3Pcode],
            name: submission[spatialDescription.adm3Name]
          },
          managedBy: {
            en: submission[options.manageByField]
              ? submission[options.manageByField]
              : options.manageByAltValue
              ? options.manageByAltValue
              : "-"
          }
        },
        submissions: [computedSubmission]
      };
      camps.push(camp);

      // Add the admin2 if it doesn't exists
      if (
        !boundariesList.admin2
          .map(x => x.pcode)
          .includes(submission[spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        });
      }

      // Add the admin1 if it doesn't exists
      if (
        !boundariesList.admin1
          .map(x => x.pcode)
          .includes(submission[spatialDescription.adm1Pcode])
      ) {
        boundariesList.admin1.push({
          pcode: submission[spatialDescription.adm1Pcode],
          name: submission[spatialDescription.adm1Name]
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

  return {
    name: surveyConfig.name,
    camps: camps,
    boundariesList: boundariesList,
    indicators: [
      computeSurveyIndicator(indicatorsDescription.home[0], camps),
      computeSurveyIndicator(indicatorsDescription.home[1], camps),
      computeSurveyIndicator(indicatorsDescription.home[2], camps)
    ],
    fdf: surveyConfig,
    options: options
  };
}
