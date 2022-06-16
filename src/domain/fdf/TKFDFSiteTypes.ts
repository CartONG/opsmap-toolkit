import { TKLabel } from "../utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDFSiteType {
  formattedName: string;
  iconFileName: {
    normal: string;
    selected: string;
  };
  thematicLabel: TKLabel;
}

export type TKFDFSiteTypeCollection = Record<string, TKFDFSiteType>;
