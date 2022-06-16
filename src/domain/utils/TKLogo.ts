import { TKLabel } from "./TKLabel";
export interface TKLogo {
  name: string;
  urlLogo: string;
  urlRedirection: string;
}

export type TKLogoGroup = {
  title: TKLabel;
  logos: TKLogo[];
};
