import { TKFDFSiteType } from "../fdf/TKFDFSiteTypes";
import { TKLabel } from "../utils/TKLabel";
import { TKBoundaries } from "./TKBoundaries";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Camp Type definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKCamp {
  id: string;
  name: string;
  type: TKFDFSiteType; // from fdf
  lat: number;
  lng: number;
  admin1: TKBoundaries;
  admin2: TKBoundaries;
  admin3: TKBoundaries;
  managedBy: TKLabel;

  submissions: [TKSubmission, ...TKSubmission[]]; // At least one element!
}
