import { TKLabel } from "@/domain/ui/TKLabel";

export enum TKIndicatorComputationType {
  SUM,
  MEAN
}

export enum TKIndicatorType {
  STANDARD = "standard",
  OCCUPATION = "site_occupation"
}

export interface TKIndicatorDescription {
  readonly type: TKIndicatorType.STANDARD;
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;
}
export interface TKIndicatorDescriptionSiteOccupation {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly type: TKIndicatorType.OCCUPATION;
  readonly name: TKLabel;
  readonly entryCodeMaxCapacity: string;
  readonly iconOchaName: string;
  readonly entryCodePeopleCount: string;
  readonly entryCodeMaxPeopleCount: string;
}

export interface TKIndicatorsDescription {
  home: [
    TKIndicatorDescription,
    TKIndicatorDescription,
    TKIndicatorDescription
  ];
  site: [
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation,
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation,
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation
  ];
}
