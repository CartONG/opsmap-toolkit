import { TKIndicatorType } from "../opsmapConfig/TKIndicatorsDescription";
import { TKLabel } from "./TKLabel";

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
  readonly valueYesNoLabel: TKLabel; // Yes or No
  readonly iconOchaName: string;
}

export type TKIndicator = TKIndicatorStandard | TKIndicatorSiteOccupation;
