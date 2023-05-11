import { ArcgisServerDataGetter } from "@/secondary/arcgis/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";

const ADM1_DB_URL = "core_v2/wrl_polbnd_adm1_a_unhcr/FeatureServer/0";
const ADM2_DB_URL = "core_v2/wrl_polbnd_adm2_a_unhcr/FeatureServer/0";

async function queryAdmins(
  dbUrl: string,
  adminList: string[],
  primaryKey: string
) {
  const adminQuery =
    primaryKey + " in (" + adminList.map(adm => `'${adm}'`).join(", ") + ")";

  return await new ArcgisServerDataGetter(
    encodeURI(dbUrl),
    encodeURI(adminQuery),
    true,
    "geojson"
  ).getData();
}

export async function TKGetGeoBoundaries(
  dataset: TKDataset,
  spatialConfiguration: TKOpsmapSpatialConfiguration
): Promise<TKGeoDataset> {
  const before = Date.now();

  // Admin1
  const admin1List = dataset.surveys.flatMap(survey =>
    survey.boundaries.admin1.map(x => x.pcode)
  );
  const admin1GeoData = await queryAdmins(
    ADM1_DB_URL,
    admin1List,
    spatialConfiguration.dbConfig.adm1DBPcode
  );

  // Admin2
  const admin2List = dataset.surveys.flatMap(survey =>
    survey.boundaries.admin2.map(x => x.pcode)
  );
  const admin2GeoData = await queryAdmins(
    ADM2_DB_URL,
    admin2List,
    spatialConfiguration.dbConfig.adm2DBPcode
  );

  console.log(
    `GeoBoundaries retrieved in ${(Date.now() - before) / 1000} seconds.`
  );

  return {
    admin1: admin1GeoData,
    admin2: admin2GeoData
  };
}
