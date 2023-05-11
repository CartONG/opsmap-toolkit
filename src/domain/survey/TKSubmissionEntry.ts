import { evaluate } from "mathjs";
import { TKFDF } from "../fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "../fdf/TKFDFTrafficLight";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import { TKLabel } from "../utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSubmissionEntryType {
  TEXT = "text",
  BULLET = "bullet",
  CHART_PYRAMID = "age_pyramid",
  CHART_DOUGHNUT = "doughnut",
  CHART_POLAR = "polar",
  CHART_RADAR = "radar"
}
export interface TKSubmissionEntryText {
  type: TKSubmissionEntryType.TEXT;
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}

export interface TKSubmissionEntryBullet {
  type: TKSubmissionEntryType.BULLET;
  field: string;
  fieldLabel: TKLabel;
  answersLabels: TKLabel[];
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid {
  type: TKSubmissionEntryType.CHART_PYRAMID;
  chartid: string;
  title: TKLabel;
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  isAnswered: true;
  femalesLabels: Array<TKLabel>;
}

export interface TKSubmissionEntryDoughnut {
  type: TKSubmissionEntryType.CHART_DOUGHNUT;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}
export interface TKSubmissionEntryPolar {
  type: TKSubmissionEntryType.CHART_POLAR;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

export interface TKSubmissionEntryRadar {
  type: TKSubmissionEntryType.CHART_RADAR;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSubmissionEntry =
  | TKSubmissionEntryText
  | TKSubmissionEntryBullet
  | TKSubmissionEntryAgePyramid
  | TKSubmissionEntryDoughnut
  | TKSubmissionEntryPolar
  | TKSubmissionEntryRadar;

// ////////////////////////////////////////////////////////////////////////////
// helpers method
// ////////////////////////////////////////////////////////////////////////////

function getTrafficLightColor(
  value: string,
  trafficLight: TKFDFTrafficLightGrouped
): TKTrafficLightValues {
  if (!value) {
    return TKTrafficLightValues.UNDEFINED;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.STRING) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightValues.UNDEFINED : match;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.MATH) {
    let match;
    for (const item of trafficLight.values) {
      const conditions = item.value.split("and");
      // TODO: remove evaluate. Only depencey to mathjs.
      const result = conditions.map(x => evaluate(Number(value) + x));
      if (!result.includes(false)) {
        match = item.color;
      }
    }
    return match === undefined ? TKTrafficLightValues.UNDEFINED : match;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.LIST) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightValues.CRITICAL : match;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.NOTINLIST) {
    const condition = value !== "none";
    return condition ? TKTrafficLightValues.OK : TKTrafficLightValues.CRITICAL;
  }
  return TKTrafficLightValues.UNDEFINED;
}

// ////////////////////////////////////////////////////////////////////////////
// EntryText creation method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionEntryBullet(
  value: string,
  field: string,
  listSeparator: string,
  surveyConfiguration: TKFDF
): TKSubmissionEntryBullet {
  const isAnswered = value !== "";
  let correctedValue: Array<TKLabel> = [];
  if (isAnswered) {
    correctedValue = value.split(listSeparator).map(x => {
      x = x.trim();
      return surveyConfiguration.answersLabels[x]
        ? surveyConfiguration.answersLabels[x]
        : { en: x };
    });
  }

  if (
    surveyConfiguration.submissionsRules[field].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[field].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.log(
      `[WARNING] Traffic light category "${surveyConfiguration.submissionsRules[field].trafficLightName}" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.BULLET,
    field: field,
    fieldLabel: surveyConfiguration.fieldsLabels[field],
    answersLabels: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[field].trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}

export function TKCreateSubmissionEntryList(
  value: string,
  field: string,
  listSeparator: string,
  surveyConfiguration: TKFDF,
  languages: string[]
): TKSubmissionEntryText {
  const isAnswered = value !== "";
  let correctedValue: Record<string, string> = {};
  if (isAnswered) {
    languages.map(
      lang =>
        (correctedValue[lang] = value
          .split(listSeparator)
          .map(x => {
            x = x.trim();
            if (
              surveyConfiguration.answersLabels[x] &&
              surveyConfiguration.answersLabels[x][lang]
            ) {
              return surveyConfiguration.answersLabels[x][lang];
            }
            const lowerCasedValue = x.toLowerCase();
            if (
              surveyConfiguration.answersLabels[lowerCasedValue] &&
              surveyConfiguration.answersLabels[lowerCasedValue][lang]
            ) {
              return surveyConfiguration.answersLabels[lowerCasedValue][lang];
            }
            return x;
          })
          .join(", "))
    );
  } else {
    correctedValue =
      isAnswered && surveyConfiguration.answersLabels[value]
        ? surveyConfiguration.answersLabels[value]
        : { en: value };
  }

  if (
    surveyConfiguration.submissionsRules[field].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[field].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.log(
      `[WARNING] Traffic light category "${surveyConfiguration.submissionsRules[field].trafficLightName}" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    field: field,
    fieldLabel: surveyConfiguration.fieldsLabels[field],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[field].trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}

export function TKCreateSubmissionEntryText(
  value: string,
  field: string,
  surveyConfiguration: TKFDF
): TKSubmissionEntryText {
  const isAnswered = value !== "";

  const correctedValue =
    isAnswered && surveyConfiguration.answersLabels[value]
      ? surveyConfiguration.answersLabels[value]
      : { en: value };

  if (
    surveyConfiguration.submissionsRules[field].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[field].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.log(
      `[WARNING] Traffic light category "${surveyConfiguration.submissionsRules[field].trafficLightName}" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    field: field,
    fieldLabel: surveyConfiguration.fieldsLabels[field],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[field].trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}
