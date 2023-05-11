/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKCreateSubmissionEntryText,
  TKSubmissionEntryType,
  TKCreateSubmissionEntryList,
  TKCreateSubmissionEntryBullet
} from "./TKSubmissionEntry";
import {
  TKChartData,
  TKCreateSubmissionChart
} from "./TKCreateSubmissionChart";
import {
  TKSubmissionThematic,
  TKCreateSubmissionThematic
} from "./TKSubmissionThematic";
import { TKIndicator, TKIndicatorType } from "@/domain/survey/TKIndicator";
import { TKLabel } from "../utils/TKLabel";
import { TKFDFSubmissionItemType } from "../fdf/TKFDFSubmissionsRules";
import { TKCompare, TKCompute } from "../utils/TKOperator";
import { TKOperatorComputation } from "../utils/TKOperator";
import { TKOperatorComparison } from "../utils/TKOperator";
import { TKFDFIndicatorSite, TKFDFIndicatorType } from "../fdf/TKFDFIndicators";
import { evaluate, round } from "mathjs";
import { TKSurveyOptions } from "./TKSurvey";

// ////////////////////////////////////////////////////////////////////////////
//  Submission concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmission {
  date: string;
  thematics: Record<string, TKSubmissionThematic>;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function getValueForIndicator(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): number | undefined {
  for (const thematic in data) {
    const them = data[thematic];
    const item = them.data.find(
      item =>
        item.type === TKSubmissionEntryType.TEXT && item.field === entryCode
    );
    if (
      item &&
      item.type === TKSubmissionEntryType.TEXT &&
      item.answerLabel &&
      !isNaN(parseFloat(item.answerLabel.en))
    ) {
      return Number(item.answerLabel.en);
    }
  }
  return undefined;
}

function getLabelForIndicator(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): TKLabel {
  for (const thematic in data) {
    const them = data[thematic];
    const item = them.data.find(
      item =>
        item.type === TKSubmissionEntryType.TEXT && item.field === entryCode
    );
    if (item && item.type === TKSubmissionEntryType.TEXT && item.answerLabel) {
      return item.answerLabel;
    }
  }
  return { en: "-" };
}
function computeSubmissionIndicator(
  descr: TKFDFIndicatorSite,
  data: Record<string, TKSubmissionThematic>
): TKIndicator {
  if (descr.type === TKFDFIndicatorType.OCCUPATION) {
    // Should be two integers
    const peopleCount = getValueForIndicator(data, descr.entryCodePeopleCount);
    const maxPeopleCount = getValueForIndicator(
      data,
      descr.entryCodeMaxPeopleCount
    );

    if (
      peopleCount !== undefined &&
      maxPeopleCount !== undefined &&
      maxPeopleCount !== 0
    ) {
      const percentValue = Math.round((peopleCount / maxPeopleCount) * 100);
      const percentText = percentValue.toString();
      const valueLabel: TKLabel = {};
      Object.keys(descr.name).map(key => {
        valueLabel[key] = "";
      });

      const labelIsMaxCapacity = descr.entryCodeMaxCapacity
        ? getLabelForIndicator(data, descr.entryCodeMaxCapacity)
        : null;
      for (const k in valueLabel) {
        valueLabel[k] = labelIsMaxCapacity
          ? labelIsMaxCapacity[k] + " (" + percentText + "%)"
          : percentText;
      }
      return {
        type: TKIndicatorType.OCCUPATION,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueNumber: percentValue,
        valueLabel: valueLabel,
        valueYesNoLabel: labelIsMaxCapacity
      };
    } else {
      return {
        type: TKIndicatorType.OCCUPATION,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { en: "-" },
        valueNumber: -1,
        valueYesNoLabel: { en: "-" }
      };
    }
  } else {
    if (descr.type === TKFDFIndicatorType.COMPUTATION) {
      const entry1Value = getValueForIndicator(data, descr.entryCode1) ?? 0;
      const entry2Value = getValueForIndicator(data, descr.entryCode2) ?? 0;
      const operation = `${entry1Value} ${descr.operator} ${entry2Value}`;
      let result = evaluate(operation);

      if (descr.numberStrategy && descr.numberStrategy === "round") {
        result = round(result);
      }

      return {
        type: TKIndicatorType.STANDARD,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { en: result }
      };
    }
    const label = getLabelForIndicator(data, descr.entryCode);
    return {
      type: TKIndicatorType.STANDARD,
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: label
    };
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Create the chart associated to the submission
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Create the submission
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmission(
  submissionItem: Record<string, string>,
  fdf: TKFDF,
  options: TKSurveyOptions,
  languages: string[]
): TKSubmission {
  // Init all the thematics
  const submission: Record<string, TKSubmissionThematic> = {};
  for (const thematic in fdf.thematics) {
    submission[thematic] = TKCreateSubmissionThematic(fdf.thematics[thematic]);
  }

  // Init chart
  const charts: Record<string, TKChartData> = {};

  for (const key in fdf.submissionsRules) {
    const rule = fdf.submissionsRules[key];

    if (submission[rule.thematicGroup]) {
      // Handle display status
      let display = true;
      if (rule.displayCondition) {
        try {
          display = TKCompare(
            submissionItem[rule.displayCondition.field],
            rule.displayCondition.operator as TKOperatorComparison,
            rule.displayCondition.value
          );
        } catch (error) {
          display = false;
        }
      }
      if (display) {
        // If charts: fill the charts record
        if (rule.chartId) {
          const value = submissionItem[rule.fieldName];

          // // Init currentChart
          if (!charts[rule.chartId]) {
            charts[rule.chartId] = {
              id: rule.chartId,
              thematic: rule.thematicGroup,
              data: []
            };
          }

          // Accumulate Chart data
          charts[rule.chartId].data.push({
            field: rule.fieldName,
            value: value,
            type: rule.chartData
          });
        }

        // If text item
        else {
          let value = "";
          switch (rule.type) {
            case TKFDFSubmissionItemType.COMPUTED:
              try {
                if (rule.computed) {
                  value = Math.round(
                    TKCompute(
                      Number(submissionItem[rule.computed.field1]),
                      rule.computed.operator as TKOperatorComputation,
                      Number(submissionItem[rule.computed.field2])
                    )
                  ).toString();
                } else {
                  value = submissionItem[rule.fieldName];
                }
              } catch (error) {
                value = "";
              }

              submission[rule.thematicGroup].data.push(
                TKCreateSubmissionEntryText(value, rule.fieldName, fdf)
              );
              break;
            case TKFDFSubmissionItemType.LIST:
              value = submissionItem[rule.fieldName];
              if (value !== undefined) {
                submission[rule.thematicGroup].data.push(
                  TKCreateSubmissionEntryList(
                    value,
                    rule.fieldName,
                    options.listSeparator,
                    fdf,
                    languages
                  )
                );
              }
              break;
            case TKFDFSubmissionItemType.BULLET:
              value = submissionItem[rule.fieldName];
              if (value !== undefined) {
                submission[rule.thematicGroup].data.push(
                  TKCreateSubmissionEntryBullet(
                    value,
                    rule.fieldName,
                    options.listSeparator,
                    fdf
                  )
                );
              }
              break;

            case TKFDFSubmissionItemType.DATE:
            case TKFDFSubmissionItemType.INTEGER:
            case TKFDFSubmissionItemType.STRING:
              value = submissionItem[rule.fieldName];
              if (value !== undefined) {
                submission[rule.thematicGroup].data.push(
                  TKCreateSubmissionEntryText(value, rule.fieldName, fdf)
                );
              }
              break;
          }
        }
      }
    }
  }

  // if a current pyramid is ongoing - push it before ending
  for (const chart of Object.values(charts)) {
    TKCreateSubmissionChart(chart, submission, fdf);
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  for (const key in submission) {
    if (submission[key].data.length > 0) {
      submissionFiltered[key] = submission[key];
    }
  }

  return {
    date: submissionItem[fdf.spatialDescription.siteLastUpdateField],
    thematics: submissionFiltered,
    indicators: [
      computeSubmissionIndicator(fdf.indicators.site[0], submission),
      computeSubmissionIndicator(fdf.indicators.site[1], submission),
      computeSubmissionIndicator(fdf.indicators.site[2], submission)
    ]
  };
}
