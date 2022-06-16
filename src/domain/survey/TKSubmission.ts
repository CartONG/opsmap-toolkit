/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKCreateSubmissionEntryText,
  TKSubmissionEntryPolar,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryAgePyramid,
  TKSubmissionEntryType,
  TKCreateSubmissionEntryList,
  TKCreateSubmissionEntryBullet
} from "./TKSubmissionEntry";
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
import { TKFDFIndicatorCamp, TKFDFIndicatorType } from "../fdf/TKFDFIndicators";
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
  descr: TKFDFIndicatorCamp,
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

type ChartData = {
  id: string;
  thematic: string;
  data: Array<{
    field: string;
    value: string;
    type: string;
  }>;
};

function createChartInSubmission(
  chartData: ChartData,
  submission: Record<string, TKSubmissionThematic>,
  surveyConfiguration: TKFDF
) {
  if (chartData.id.includes("age_pyramid")) {
    const malesEntries = chartData.data
      .filter(item => item.type === "m")
      .reverse();
    const femalesEntries = chartData.data
      .filter(item => item.type === "f")
      .reverse();

    const entry: TKSubmissionEntryAgePyramid = {
      type: TKSubmissionEntryType.CHART_PYRAMID,
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      malesEntries: malesEntries.map(item => Number(item.value)),
      femalesEntries: femalesEntries.map(item => Number(item.value)),
      malesLabels: malesEntries.map(
        item => surveyConfiguration.fieldsLabels[item.field]
      ),
      femalesLabels: femalesEntries.map(
        item => surveyConfiguration.fieldsLabels[item.field]
      )
    };
    submission[chartData.thematic].data.push(entry);
  } else if (chartData.id.includes("doughnut")) {
    const entry: TKSubmissionEntryDoughnut = {
      type: TKSubmissionEntryType.CHART_DOUGHNUT,
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      entries: chartData.data.map(item => {
        return {
          value: Number(item.value),
          label: surveyConfiguration.fieldsLabels[item.field]
        };
      })
    };
    submission[chartData.thematic].data.push(entry);
  } else if (chartData.id.includes("polar_area_chart")) {
    const entry: TKSubmissionEntryPolar = {
      type: TKSubmissionEntryType.CHART_POLAR,
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      entries: chartData.data.map(item => {
        return {
          value: Number(item.value),
          label: surveyConfiguration.fieldsLabels[item.field]
        };
      })
    };
    submission[chartData.thematic].data.push(entry);
  }
}

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
  const currentChart: ChartData = {
    id: "",
    thematic: "",
    data: []
  };

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
        // If charts
        if (rule.chartId) {
          const value = submissionItem[rule.fieldName];

          // If exists chart
          if (currentChart.id && rule.chartId !== currentChart.id) {
            createChartInSubmission(currentChart, submission, fdf);

            // Clear current submission
            currentChart.id = "";
            currentChart.thematic = "";
            currentChart.data = [];
          }

          // Init currentChart
          if (!currentChart.id) {
            currentChart.id = rule.chartId;
            currentChart.thematic = rule.thematicGroup;
            currentChart.data = [];
          }

          // Accumulate Chart data
          currentChart.data.push({
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

          // If exists chart
          if (currentChart.id) {
            createChartInSubmission(currentChart, submission, fdf);

            // Clear current submission
            currentChart.id = "";
            currentChart.thematic = "";
            currentChart.data = [];
          }
        }
      }
    }
  }

  // if a current pyramid is ongoing - push it before ending
  if (currentChart.id) {
    createChartInSubmission(currentChart, submission, fdf);
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
