import { TKLabel } from "@/domain/utils/TKLabel";
import {
  TKFDFIndicator,
  TKFDFIndicatorType
} from "@/domain/fdf/TKFDFIndicators";
import { PEOPLE_COUNT_LABEL, SITE_COUNT_LABEL } from "./TKIndicatorLabels";

export enum TKIndicatorType {
  STANDARD = "standard",
  OCCUPATION = "site_occupation"
}

export interface TKIndicatorStandard {
  readonly type: TKIndicatorType.STANDARD;
  readonly nameLabel: TKLabel;
  readonly valueLabel: TKLabel;
  readonly iconOchaName: string;
}

export interface TKIndicatorSiteOccupation {
  readonly type: TKIndicatorType.OCCUPATION;
  readonly nameLabel: TKLabel;
  readonly valueNumber: number; // percentage: 12
  readonly valueLabel: TKLabel; // like : Yes (12%)tooltip, displayable, etC.
  readonly valueYesNoLabel: TKLabel | null; // Yes or No. nullable
  readonly iconOchaName: string;
}

export const SITE_COUNT_ICON = "IDP-refugee-camp";
export const PEOPLE_COUNT_ICON = "People-in-need";

export type TKIndicator = TKIndicatorStandard | TKIndicatorSiteOccupation;

export function TKIndicatorDefault(ref: TKFDFIndicator): TKIndicator {
  switch (ref.type) {
    case TKFDFIndicatorType.OCCUPATION:
      return {
        type: TKIndicatorType.OCCUPATION,
        valueNumber: -1,
        valueYesNoLabel: { en: "-" },
        nameLabel: ref.name,
        valueLabel: { en: "-" },
        iconOchaName: ref.iconOchaName
      };
    case TKFDFIndicatorType.SITE_COUNT:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: SITE_COUNT_LABEL,
        valueLabel: { en: "-" },
        iconOchaName: SITE_COUNT_ICON
      };
    case TKFDFIndicatorType.PEOPLE_COUNT:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: PEOPLE_COUNT_LABEL,
        valueLabel: { en: "-" },
        iconOchaName: PEOPLE_COUNT_ICON
      };

    case TKFDFIndicatorType.STANDARD:
    case TKFDFIndicatorType.VALUE_COUNT:
    case TKFDFIndicatorType.COMPUTATION:
    default:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: ref.name,
        valueLabel: { en: "-" },
        iconOchaName: ref.iconOchaName
      };
  }
}
