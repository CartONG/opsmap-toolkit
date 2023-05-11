import { TKFDFSiteType } from "../fdf/TKFDFSiteTypes";
import { TKLabel } from "../utils/TKLabel";
import { TKBoundaries } from "./TKBoundaries";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Site Type definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSiteCoordinates {
  lat: number;
  lng: number;
}
export interface TKSite {
  id: string;
  name: string;
  type: TKFDFSiteType; // from fdf
  coordinates: TKSiteCoordinates;
  admin1: TKBoundaries;
  admin2: TKBoundaries;
  managedBy: TKLabel;

  submissions: [TKSubmission, ...TKSubmission[]]; // At least one element!
}
