// ////////////////////////////////////////////////////////////////////////////
// Description of the spatial configuration
// field name, etc.

// ////////////////////////////////////////////////////////////////////////////
export interface TKSpatialDescription {
  siteLatitudeField: string;
  siteLongitudeField: string;
  siteNameField: string;
  siteIDField: string;
  siteLastUpdateField: string;
  siteTypeField: string;
  adm1Pcode: string; //pcode field in dataset
  adm1DBPcode: string; //pcode field in UNHCR DB
  adm1Name: string;
  adm2Pcode: string; //pcode field in dataset
  adm2DBPcode: string; //pcode field in UNHCR DB
  adm2Name: string;
  adm2RefInAdm1: string;
  adm3Pcode: string;
  adm3Name: string;
  admin0LocalURL: string;
  admin1LocalURL: string;
}
