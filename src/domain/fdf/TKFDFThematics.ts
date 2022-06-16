import { TKLabel } from "../utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDFThematic {
  formattedName: string;
  iconFileName: string;
  thematicLabel: TKLabel;
}

export type TKTFDFhematicsCollection = Record<string, TKFDFThematic>;
