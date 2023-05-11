// ////////////////////////////////////////////////////////////////////////////
// Description of the spatial configuration
// field name, etc.

// ////////////////////////////////////////////////////////////////////////////

// TODO: rename this
export interface TKFDFSpatialDescription {
  siteIDField: string;
  siteManageByField: string;
  siteManageByAltValue?: string;
  siteNameField: string;
  siteLastUpdateField: string;
  siteLatitudeField?: string;
  siteLongitudeField?: string;
  siteTypeField: string;
  adm1Pcode: string; //pcode field in dataset
  adm1Name: string;
  adm2Pcode: string; //pcode field in dataset
  adm2Name: string;
}
